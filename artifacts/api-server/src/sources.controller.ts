import { Controller, Get, Post, Delete, Body, Param, UseGuards, Req, NotFoundException } from "@nestjs/common";
import { db, sourcesTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { AuthGuard, getUserFromRequest } from "./lib/auth.guard";
import {
  GetSourcesResponse, AddSourceBody, RemoveSourceParams, RemoveSourceResponse
} from "@workspace/api-zod";

@Controller("sources")
export class SourcesController {
  @Get()
  @UseGuards(AuthGuard)
  async getSources(@Req() req: Record<string, unknown>) {
    const { userId } = getUserFromRequest(req);
    const sources = await db.select().from(sourcesTable).where(eq(sourcesTable.userId, userId));

    return GetSourcesResponse.parse(
      sources.map(s => ({
        id: s.id,
        name: s.name,
        type: s.type,
        status: s.status,
        institution: s.institution,
        maskedAccount: s.maskedAccount ?? undefined,
        lastSync: s.lastSync?.toISOString() ?? undefined,
      }))
    );
  }

  @Post()
  @UseGuards(AuthGuard)
  async addSource(@Req() req: Record<string, unknown>, @Body() body: unknown) {
    const { userId } = getUserFromRequest(req);
    const { name, type, institution } = AddSourceBody.parse(body);

    const [source] = await db.insert(sourcesTable).values({
      userId,
      name,
      type,
      institution,
      status: "pending",
      maskedAccount: `****${Math.floor(1000 + Math.random() * 9000)}`,
      lastSync: new Date(),
    }).returning();

    return {
      id: source!.id,
      name: source!.name,
      type: source!.type,
      status: source!.status,
      institution: source!.institution,
      maskedAccount: source!.maskedAccount ?? undefined,
      lastSync: source!.lastSync?.toISOString() ?? undefined,
    };
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  async removeSource(@Req() req: Record<string, unknown>, @Param() params: unknown) {
    const { userId } = getUserFromRequest(req);
    const { id } = RemoveSourceParams.parse(params);

    const [source] = await db.select().from(sourcesTable)
      .where(and(eq(sourcesTable.id, id), eq(sourcesTable.userId, userId))).limit(1);

    if (!source) throw new NotFoundException("Source not found");

    await db.delete(sourcesTable).where(eq(sourcesTable.id, id));

    return RemoveSourceResponse.parse({ message: "Source removed successfully" });
  }
}

import { Controller, Get, Patch, Body, UseGuards, Req, NotFoundException } from "@nestjs/common";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { AuthGuard, getUserFromRequest } from "./lib/auth.guard";
import { GetProfileResponse, UpdateProfileBody, UpdateProfileResponse } from "@workspace/api-zod";

@Controller("profile")
export class ProfileController {
  @Get()
  @UseGuards(AuthGuard)
  async getProfile(@Req() req: Record<string, unknown>) {
    const { userId } = getUserFromRequest(req);
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
    if (!user) throw new NotFoundException("User not found");

    return GetProfileResponse.parse({
      userId: user.id,
      name: user.name,
      email: user.email,
      locale: user.locale,
      emailVerified: user.emailVerified,
      monthlyIncome: user.monthlyIncome ? Number(user.monthlyIncome) : undefined,
      currency: user.currency,
      memberSince: user.createdAt.toISOString(),
    });
  }

  @Patch()
  @UseGuards(AuthGuard)
  async updateProfile(@Req() req: Record<string, unknown>, @Body() body: unknown) {
    const { userId } = getUserFromRequest(req);
    const updates = UpdateProfileBody.parse(body);

    const [user] = await db.update(usersTable).set({
      ...(updates.name !== undefined && { name: updates.name }),
      ...(updates.locale !== undefined && { locale: updates.locale }),
      ...(updates.monthlyIncome !== undefined && { monthlyIncome: String(updates.monthlyIncome) }),
      ...(updates.currency !== undefined && { currency: updates.currency }),
      updatedAt: new Date(),
    }).where(eq(usersTable.id, userId)).returning();

    if (!user) throw new NotFoundException("User not found");

    return UpdateProfileResponse.parse({
      userId: user.id,
      name: user.name,
      email: user.email,
      locale: user.locale,
      emailVerified: user.emailVerified,
      monthlyIncome: user.monthlyIncome ? Number(user.monthlyIncome) : undefined,
      currency: user.currency,
      memberSince: user.createdAt.toISOString(),
    });
  }
}

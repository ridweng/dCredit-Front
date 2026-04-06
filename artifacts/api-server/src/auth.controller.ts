import {
  Controller, Post, Get, Body, UseGuards, Req, ConflictException, UnauthorizedException, BadRequestException
} from "@nestjs/common";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { hashPassword, verifyPassword, signToken } from "./lib/auth";
import { AuthGuard, getUserFromRequest } from "./lib/auth.guard";
import {
  RegisterBody, LoginBody, VerifyEmailBody,
  LoginResponse, GetMeResponse, LogoutResponse, VerifyEmailResponse
} from "@workspace/api-zod";

@Controller("auth")
export class AuthController {
  @Post("register")
  async register(@Body() body: unknown) {
    const { name, email, password, locale } = RegisterBody.parse(body);

    const existing = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
    if (existing.length > 0) {
      throw new ConflictException("Email already in use");
    }

    const passwordHash = await hashPassword(password);
    const emailVerificationToken = crypto.randomUUID();

    const [user] = await db.insert(usersTable).values({
      name,
      email,
      passwordHash,
      locale: locale ?? "en",
      emailVerificationToken,
      emailVerified: false,
    }).returning();

    const accessToken = signToken({ userId: user.id, email: user.email });

    return LoginResponse.parse({
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified,
        locale: user.locale,
        createdAt: user.createdAt.toISOString(),
      },
    });
  }

  @Post("login")
  async login(@Body() body: unknown) {
    const { email, password } = LoginBody.parse(body);

    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
    if (!user) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const accessToken = signToken({ userId: user.id, email: user.email });

    return LoginResponse.parse({
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified,
        locale: user.locale,
        createdAt: user.createdAt.toISOString(),
      },
    });
  }

  @Post("logout")
  @UseGuards(AuthGuard)
  logout() {
    return LogoutResponse.parse({ message: "Logged out successfully" });
  }

  @Post("verify-email")
  async verifyEmail(@Body() body: unknown) {
    const { token } = VerifyEmailBody.parse(body);

    const [user] = await db.select().from(usersTable)
      .where(eq(usersTable.emailVerificationToken, token)).limit(1);

    if (!user) {
      throw new BadRequestException("Invalid or expired verification token");
    }

    await db.update(usersTable).set({
      emailVerified: true,
      emailVerificationToken: null,
      updatedAt: new Date(),
    }).where(eq(usersTable.id, user.id));

    return VerifyEmailResponse.parse({ message: "Email verified successfully" });
  }

  @Get("me")
  @UseGuards(AuthGuard)
  async getMe(@Req() req: Record<string, unknown>) {
    const { userId } = getUserFromRequest(req);

    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
    if (!user) throw new UnauthorizedException("User not found");

    return GetMeResponse.parse({
      id: user.id,
      email: user.email,
      name: user.name,
      emailVerified: user.emailVerified,
      locale: user.locale,
      createdAt: user.createdAt.toISOString(),
    });
  }
}

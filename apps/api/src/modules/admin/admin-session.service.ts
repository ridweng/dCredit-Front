import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { JwtPayload } from '../auth/types/jwt-payload.type';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';

const ADMIN_COOKIE_NAME = 'dcredit_admin_token';
const ONE_HOUR_MS = 60 * 60 * 1000;

@Injectable()
export class AdminSessionService {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  getCookieName(): string {
    return ADMIN_COOKIE_NAME;
  }

  async loginAdmin(email: string, password: string) {
    const result = await this.authService.login({ email, password });

    if (!result.user.isAdmin) {
      throw new UnauthorizedException('Admin access is required.');
    }

    return result;
  }

  async getAdminUserFromRequest(request: Request): Promise<User | null> {
    const token = this.extractTokenFromCookieHeader(request.headers.cookie);

    if (!token) {
      return null;
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);

      if (!payload.isAdmin) {
        return null;
      }

      const user = await this.usersService.findById(payload.sub);

      if (!user || !user.isAdmin) {
        return null;
      }

      return user;
    } catch {
      return null;
    }
  }

  setAdminCookie(response: Response, token: string): void {
    response.cookie(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: ONE_HOUR_MS,
      path: '/admin',
    });
  }

  clearAdminCookie(response: Response): void {
    response.clearCookie(ADMIN_COOKIE_NAME, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      path: '/admin',
    });
  }

  private extractTokenFromCookieHeader(cookieHeader?: string): string | null {
    if (!cookieHeader) {
      return null;
    }

    const parts = cookieHeader.split(';').map((value) => value.trim());

    for (const part of parts) {
      if (part.startsWith(`${ADMIN_COOKIE_NAME}=`)) {
        return decodeURIComponent(part.slice(ADMIN_COOKIE_NAME.length + 1));
      }
    }

    return null;
  }
}

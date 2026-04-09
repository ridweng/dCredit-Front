import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcryptjs';
import type { Request, Response } from 'express';
import { Repository } from 'typeorm';
import { JwtPayload, User } from '@dcredit/backend-shared';

const ADMIN_COOKIE_NAME = 'dcredit_admin_token';
const ONE_HOUR_MS = 60 * 60 * 1000;

@Injectable()
export class AdminSessionService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async loginAdmin(email: string, password: string): Promise<string> {
    const user = await this.userRepository.findOne({
      where: { email: email.trim().toLowerCase() },
    });

    if (!user || !user.isAdmin) {
      throw new UnauthorizedException('Admin access is required.');
    }

    const passwordMatches = await compare(password, user.passwordHash);

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid admin credentials.');
    }

    return this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      emailVerified: user.emailVerified,
      isAdmin: user.isAdmin,
    });
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

      const user = await this.userRepository.findOne({ where: { id: payload.sub } });
      return user?.isAdmin ? user : null;
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

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { User } from '../users/user.entity';
import { AdminSessionService } from './admin-session.service';

type AdminRequest = Request & {
  user?: User;
};

@Injectable()
export class AdminSessionGuard implements CanActivate {
  constructor(private readonly adminSessionService: AdminSessionService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AdminRequest>();
    const adminUser = await this.adminSessionService.getAdminUserFromRequest(request);

    if (!adminUser) {
      throw new UnauthorizedException('Admin authentication is required.');
    }

    request.user = adminUser;
    return true;
  }
}

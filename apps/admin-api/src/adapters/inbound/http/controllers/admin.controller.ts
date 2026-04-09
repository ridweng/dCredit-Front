import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { AdminHtmlService } from '@dcredit/backend-shared';
import { AdminSessionService } from '../../../../infrastructure/auth/admin-session.service';

@ApiExcludeController()
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminHtmlService: AdminHtmlService,
    private readonly adminSessionService: AdminSessionService,
  ) {}

  @Get()
  async getDashboard(@Req() request: Request, @Res() response: Response) {
    const adminUser = await this.adminSessionService.getAdminUserFromRequest(request);

    if (!adminUser) {
      return response.redirect('/admin/login');
    }

    return response.type('html').send(this.adminHtmlService.renderDashboardPage(adminUser));
  }

  @Get('login')
  async getLoginPage(@Req() request: Request, @Res() response: Response) {
    const adminUser = await this.adminSessionService.getAdminUserFromRequest(request);

    if (adminUser) {
      return response.redirect('/admin');
    }

    const error =
      typeof request.query.error === 'string' && request.query.error.length > 0
        ? request.query.error
        : undefined;

    return response.type('html').send(this.adminHtmlService.renderLoginPage(error));
  }

  @Post('login')
  async login(
    @Body('email') email: string | undefined,
    @Body('password') password: string | undefined,
    @Res() response: Response,
  ) {
    if (!email || !password) {
      return response.redirect('/admin/login?error=Email%20and%20password%20are%20required.');
    }

    try {
      const accessToken = await this.adminSessionService.loginAdmin(email, password);
      this.adminSessionService.setAdminCookie(response, accessToken);
      return response.redirect('/admin');
    } catch {
      return response.redirect('/admin/login?error=Invalid%20admin%20credentials.');
    }
  }

  @Post('logout')
  logout(@Res() response: Response) {
    this.adminSessionService.clearAdminCookie(response);
    return response.redirect('/admin/login');
  }

  @Get('docs')
  async getDocsRedirect(@Req() request: Request, @Res() response: Response) {
    const adminUser = await this.adminSessionService.getAdminUserFromRequest(request);

    if (!adminUser) {
      return response.redirect('/admin/login');
    }

    return response.redirect('/api/docs');
  }
}

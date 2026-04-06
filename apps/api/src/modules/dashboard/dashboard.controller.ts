import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthenticatedRequestUser } from '../auth/types/authenticated-request-user.type';
import { DashboardService } from './dashboard.service';

@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  getSummary(@CurrentUser() currentUser: AuthenticatedRequestUser) {
    return this.dashboardService.getSummary(currentUser.id);
  }

  @Get('liquid-balance')
  getLiquidBalance(@CurrentUser() currentUser: AuthenticatedRequestUser) {
    return this.dashboardService.getLiquidBalance(currentUser.id);
  }

  @Get('weekly-spending')
  getWeeklySpending(@CurrentUser() currentUser: AuthenticatedRequestUser) {
    return this.dashboardService.getWeeklySpending(currentUser.id);
  }
}

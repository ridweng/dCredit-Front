import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  CurrentUser,
  JwtAuthGuard,
  type AuthenticatedRequestUser,
} from '@dcredit/backend-shared';
import {
  GetDashboardSummaryUseCase,
  GetLiquidBalanceUseCase,
  GetWeeklySpendingUseCase,
} from '../../../../application/use-cases/dashboard/dashboard.use-cases';

@ApiTags('dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly getDashboardSummaryUseCase: GetDashboardSummaryUseCase,
    private readonly getLiquidBalanceUseCase: GetLiquidBalanceUseCase,
    private readonly getWeeklySpendingUseCase: GetWeeklySpendingUseCase,
  ) {}

  @Get('summary')
  getSummary(@CurrentUser() currentUser: AuthenticatedRequestUser) {
    return this.getDashboardSummaryUseCase.execute(currentUser.id);
  }

  @Get('liquid-balance')
  getLiquidBalance(@CurrentUser() currentUser: AuthenticatedRequestUser) {
    return this.getLiquidBalanceUseCase.execute(currentUser.id);
  }

  @Get('weekly-spending')
  getWeeklySpending(@CurrentUser() currentUser: AuthenticatedRequestUser) {
    return this.getWeeklySpendingUseCase.execute(currentUser.id);
  }
}

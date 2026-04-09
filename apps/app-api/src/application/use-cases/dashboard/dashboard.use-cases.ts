import { Inject, Injectable } from '@nestjs/common';
import type {
  DashboardSummaryResponse,
  LiquidBalanceResponse,
  WeeklySpendingResponse,
} from '@dcredit/types';
import { APP_API_TOKENS } from '../../ports/app-api.tokens';
import { type DashboardReadPort } from '../../ports/auth.ports';

@Injectable()
export class GetDashboardSummaryUseCase {
  constructor(
    @Inject(APP_API_TOKENS.dashboardReadPort)
    private readonly dashboardReadPort: DashboardReadPort,
  ) {}

  execute(userId: string): Promise<DashboardSummaryResponse> {
    return this.dashboardReadPort.getSummary(userId);
  }
}

@Injectable()
export class GetLiquidBalanceUseCase {
  constructor(
    @Inject(APP_API_TOKENS.dashboardReadPort)
    private readonly dashboardReadPort: DashboardReadPort,
  ) {}

  execute(userId: string): Promise<LiquidBalanceResponse> {
    return this.dashboardReadPort.getLiquidBalance(userId);
  }
}

@Injectable()
export class GetWeeklySpendingUseCase {
  constructor(
    @Inject(APP_API_TOKENS.dashboardReadPort)
    private readonly dashboardReadPort: DashboardReadPort,
  ) {}

  execute(userId: string): Promise<WeeklySpendingResponse> {
    return this.dashboardReadPort.getWeeklySpending(userId);
  }
}

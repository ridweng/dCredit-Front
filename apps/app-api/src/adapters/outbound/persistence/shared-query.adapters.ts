import { Injectable } from '@nestjs/common';
import {
  CreditsService,
  DashboardService,
  FinancialSourceStatus,
  FinancialSourcesService,
  ProviderType,
} from '@dcredit/backend-shared';
import type {
  CreateFinancialSourceInput,
  CreditDetailResponse,
  CreditsListResponse,
  CreditTimelineResponse,
  DashboardSummaryResponse,
  FinancialSourcesResponse,
  LiquidBalanceResponse,
  UpdateFinancialSourceInput,
  WeeklySpendingResponse,
} from '@dcredit/types';
import type {
  CreditsReadPort,
  DashboardReadPort,
  FinancialSourcesPort,
} from '../../../application/ports/auth.ports';

@Injectable()
export class SharedDashboardReadAdapter implements DashboardReadPort {
  constructor(private readonly dashboardService: DashboardService) {}

  getSummary(userId: string): Promise<DashboardSummaryResponse> {
    return this.dashboardService.getSummary(userId);
  }

  getLiquidBalance(userId: string): Promise<LiquidBalanceResponse> {
    return this.dashboardService.getLiquidBalance(userId);
  }

  getWeeklySpending(userId: string): Promise<WeeklySpendingResponse> {
    return this.dashboardService.getWeeklySpending(userId);
  }
}

@Injectable()
export class SharedCreditsReadAdapter implements CreditsReadPort {
  constructor(private readonly creditsService: CreditsService) {}

  getCredits(userId: string): Promise<CreditsListResponse> {
    return this.creditsService.listCreditsView(userId);
  }

  getCreditDetails(userId: string, creditId: string): Promise<CreditDetailResponse> {
    return this.creditsService.getCreditDetails(userId, creditId);
  }

  getCreditTimeline(userId: string): Promise<CreditTimelineResponse> {
    return this.creditsService.getTimeline(userId);
  }
}

@Injectable()
export class SharedFinancialSourcesAdapter implements FinancialSourcesPort {
  constructor(private readonly financialSourcesService: FinancialSourcesService) {}

  getFinancialSources(userId: string): Promise<FinancialSourcesResponse> {
    return this.financialSourcesService.listViewForUser(userId);
  }

  createFinancialSource(userId: string, input: CreateFinancialSourceInput): Promise<unknown> {
    return this.financialSourcesService.createForUser(userId, {
      ...input,
      providerType: input.providerType as ProviderType,
      status: input.status as FinancialSourceStatus,
    });
  }

  updateFinancialSource(
    userId: string,
    financialSourceId: string,
    input: UpdateFinancialSourceInput,
  ): Promise<unknown> {
    return this.financialSourcesService.updateForUser(userId, financialSourceId, {
      ...input,
      providerType: input.providerType as ProviderType | undefined,
      status: input.status as FinancialSourceStatus | undefined,
    });
  }
}

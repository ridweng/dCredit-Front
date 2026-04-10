import type { DashboardApiPort, TransactionsApiPort } from '../ports/app-api.ports';
import type { RecentTransactionsQuery } from '@dcredit/types';

export function loadSpendingSummaryUseCase(dashboardApi: DashboardApiPort, token: string) {
  return dashboardApi.getWeeklySpending(token);
}

export function loadCategorySummaryUseCase(
  transactionsApi: TransactionsApiPort,
  token: string,
) {
  return transactionsApi.getCategoriesSummary(token);
}

export function loadRecentTransactionsUseCase(
  transactionsApi: TransactionsApiPort,
  token: string,
  params?: RecentTransactionsQuery,
) {
  return transactionsApi.getRecentTransactions(token, params);
}

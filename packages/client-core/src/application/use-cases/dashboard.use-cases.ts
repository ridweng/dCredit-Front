import type { DashboardApiPort } from '../ports/app-api.ports';

export function loadDashboardSummaryUseCase(dashboardApi: DashboardApiPort, token: string) {
  return dashboardApi.getSummary(token);
}

export function loadWeeklySpendingUseCase(dashboardApi: DashboardApiPort, token: string) {
  return dashboardApi.getWeeklySpending(token);
}

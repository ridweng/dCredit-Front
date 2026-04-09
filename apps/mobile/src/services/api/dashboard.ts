import { appApiRoutes } from '@dcredit/core';
import { apiRequest } from './client';
import type { DashboardSummaryResponse, WeeklySpendingResponse } from '@/types/api';

export function getDashboardSummary(token: string) {
  return apiRequest<DashboardSummaryResponse>(appApiRoutes.dashboard.summary, {}, token);
}

export function getWeeklySpending(token: string) {
  return apiRequest<WeeklySpendingResponse>(appApiRoutes.dashboard.weeklySpending, {}, token);
}

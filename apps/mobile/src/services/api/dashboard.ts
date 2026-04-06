import { apiRequest } from './client';
import type { DashboardSummaryResponse, WeeklySpendingResponse } from '@/types/api';

export function getDashboardSummary(token: string) {
  return apiRequest<DashboardSummaryResponse>('/dashboard/summary', {}, token);
}

export function getWeeklySpending(token: string) {
  return apiRequest<WeeklySpendingResponse>('/dashboard/weekly-spending', {}, token);
}

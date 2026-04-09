import { appApiRoutes } from '@dcredit/core';
import { apiRequest } from './client';
import type {
  DashboardSummaryResponse,
  LiquidBalanceResponse,
  WeeklySpendingResponse,
} from '@/types/api';

export function getDashboardSummary() {
  return apiRequest<DashboardSummaryResponse>(appApiRoutes.dashboard.summary);
}

export function getLiquidBalance() {
  return apiRequest<LiquidBalanceResponse>(appApiRoutes.dashboard.liquidBalance);
}

export function getWeeklySpending() {
  return apiRequest<WeeklySpendingResponse>(appApiRoutes.dashboard.weeklySpending);
}

import { apiRequest } from './client';
import type {
  DashboardSummaryResponse,
  LiquidBalanceResponse,
  WeeklySpendingResponse,
} from '@/types/api';

export function getDashboardSummary() {
  return apiRequest<DashboardSummaryResponse>('/dashboard/summary');
}

export function getLiquidBalance() {
  return apiRequest<LiquidBalanceResponse>('/dashboard/liquid-balance');
}

export function getWeeklySpending() {
  return apiRequest<WeeklySpendingResponse>('/dashboard/weekly-spending');
}

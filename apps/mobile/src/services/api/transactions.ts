import { appApiRoutes, buildTransactionsPath } from '@dcredit/core';
import { apiRequest } from './client';
import type {
  CategorySummaryResponse,
  RecentTransactionsResponse,
} from '@/types/api';

export function getCategoriesSummary(token: string) {
  return apiRequest<CategorySummaryResponse>(appApiRoutes.transactions.categoriesSummary, {}, token);
}

export function getRecentTransactions(token: string, categoryKey?: string) {
  return apiRequest<RecentTransactionsResponse>(
    buildTransactionsPath({ limit: 8, categoryKey }),
    {},
    token,
  );
}

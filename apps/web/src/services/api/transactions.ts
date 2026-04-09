import { appApiRoutes, buildTransactionsPath } from '@dcredit/core';
import { apiRequest } from './client';
import type {
  CategorySummaryResponse,
  RecentTransactionsQuery,
  RecentTransactionsResponse,
} from '@/types/api';

export function getCategoriesSummary() {
  return apiRequest<CategorySummaryResponse>(appApiRoutes.transactions.categoriesSummary);
}

export function getRecentTransactions(params?: RecentTransactionsQuery) {
  return apiRequest<RecentTransactionsResponse>(buildTransactionsPath(params));
}

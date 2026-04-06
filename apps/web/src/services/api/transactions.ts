import { apiRequest } from './client';
import type { CategorySummaryResponse, RecentTransactionsResponse } from '@/types/api';

export function getCategoriesSummary() {
  return apiRequest<CategorySummaryResponse>('/transactions/categories-summary');
}

export function getRecentTransactions(params?: { limit?: number; categoryKey?: string }) {
  const search = new URLSearchParams();

  if (params?.limit) {
    search.set('limit', String(params.limit));
  }

  if (params?.categoryKey) {
    search.set('categoryKey', params.categoryKey);
  }

  const suffix = search.size > 0 ? `?${search.toString()}` : '';
  return apiRequest<RecentTransactionsResponse>(`/transactions${suffix}`);
}

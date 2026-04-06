import { apiRequest } from './client';
import type {
  CategorySummaryResponse,
  RecentTransactionsResponse,
} from '@/types/api';

export function getCategoriesSummary(token: string) {
  return apiRequest<CategorySummaryResponse>('/transactions/categories-summary', {}, token);
}

export function getRecentTransactions(token: string, categoryKey?: string) {
  const params = new URLSearchParams();

  if (categoryKey) {
    params.set('categoryKey', categoryKey);
  }

  params.set('limit', '8');

  return apiRequest<RecentTransactionsResponse>(`/transactions?${params.toString()}`, {}, token);
}

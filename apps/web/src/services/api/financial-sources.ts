import { apiRequest } from './client';
import type {
  CreateFinancialSourceInput,
  FinancialSourcesResponse,
  UpdateFinancialSourceInput,
} from '@/types/api';

export function getFinancialSources() {
  return apiRequest<FinancialSourcesResponse>('/financial-sources');
}

export function createFinancialSource(body: CreateFinancialSourceInput) {
  return apiRequest('/financial-sources', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function updateFinancialSource(financialSourceId: string, body: UpdateFinancialSourceInput) {
  return apiRequest(`/financial-sources/${financialSourceId}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

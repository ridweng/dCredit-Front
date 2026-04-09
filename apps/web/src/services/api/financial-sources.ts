import { appApiRoutes } from '@dcredit/core';
import { apiRequest } from './client';
import type {
  CreateFinancialSourceInput,
  FinancialSourcesResponse,
  UpdateFinancialSourceInput,
} from '@/types/api';

export function getFinancialSources() {
  return apiRequest<FinancialSourcesResponse>(appApiRoutes.financialSources.list);
}

export function createFinancialSource(body: CreateFinancialSourceInput) {
  return apiRequest(appApiRoutes.financialSources.list, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function updateFinancialSource(financialSourceId: string, body: UpdateFinancialSourceInput) {
  return apiRequest(appApiRoutes.financialSources.detail(financialSourceId), {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

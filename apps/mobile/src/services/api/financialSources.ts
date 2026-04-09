import { appApiRoutes } from '@dcredit/core';
import { apiRequest } from './client';
import type { CreateFinancialSourceInput, FinancialSourcesResponse } from '@/types/api';

export function getFinancialSources(token: string) {
  return apiRequest<FinancialSourcesResponse>(appApiRoutes.financialSources.list, {}, token);
}

export function createFinancialSource(
  token: string,
  input: CreateFinancialSourceInput,
) {
  return apiRequest(
    appApiRoutes.financialSources.list,
    {
      method: 'POST',
      body: JSON.stringify(input),
    },
    token,
  );
}

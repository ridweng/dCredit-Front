import { apiRequest } from './client';
import type { FinancialSourcesResponse } from '@/types/api';

export function getFinancialSources(token: string) {
  return apiRequest<FinancialSourcesResponse>('/financial-sources', {}, token);
}

export function createFinancialSource(
  token: string,
  input: {
    providerName: string;
    providerType: string;
    status: string;
    credentialReference: string;
  },
) {
  return apiRequest(
    '/financial-sources',
    {
      method: 'POST',
      body: JSON.stringify(input),
    },
    token,
  );
}

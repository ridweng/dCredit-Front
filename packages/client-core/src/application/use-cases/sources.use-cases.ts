import type {
  CreateFinancialSourceInput,
  UpdateFinancialSourceInput,
} from '@dcredit/types';
import type { FinancialSourcesApiPort } from '../ports/app-api.ports';

export function loadFinancialSourcesUseCase(
  financialSourcesApi: FinancialSourcesApiPort,
  token: string,
) {
  return financialSourcesApi.getFinancialSources(token);
}

export function createFinancialSourceUseCase(
  financialSourcesApi: FinancialSourcesApiPort,
  token: string,
  input: CreateFinancialSourceInput,
) {
  return financialSourcesApi.createFinancialSource(token, input);
}

export function updateFinancialSourceUseCase(
  financialSourcesApi: FinancialSourcesApiPort,
  token: string,
  financialSourceId: string,
  input: UpdateFinancialSourceInput,
) {
  return financialSourcesApi.updateFinancialSource(token, financialSourceId, input);
}

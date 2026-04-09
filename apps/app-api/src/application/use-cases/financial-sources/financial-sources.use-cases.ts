import { Inject, Injectable } from '@nestjs/common';
import type {
  CreateFinancialSourceInput,
  FinancialSourcesResponse,
  UpdateFinancialSourceInput,
} from '@dcredit/types';
import { APP_API_TOKENS } from '../../ports/app-api.tokens';
import { type FinancialSourcesPort } from '../../ports/auth.ports';

@Injectable()
export class ListFinancialSourcesUseCase {
  constructor(
    @Inject(APP_API_TOKENS.financialSourcesPort)
    private readonly financialSourcesPort: FinancialSourcesPort,
  ) {}

  execute(userId: string): Promise<FinancialSourcesResponse> {
    return this.financialSourcesPort.getFinancialSources(userId);
  }
}

@Injectable()
export class CreateFinancialSourceUseCase {
  constructor(
    @Inject(APP_API_TOKENS.financialSourcesPort)
    private readonly financialSourcesPort: FinancialSourcesPort,
  ) {}

  execute(userId: string, input: CreateFinancialSourceInput): Promise<unknown> {
    return this.financialSourcesPort.createFinancialSource(userId, input);
  }
}

@Injectable()
export class UpdateFinancialSourceUseCase {
  constructor(
    @Inject(APP_API_TOKENS.financialSourcesPort)
    private readonly financialSourcesPort: FinancialSourcesPort,
  ) {}

  execute(
    userId: string,
    financialSourceId: string,
    input: UpdateFinancialSourceInput,
  ): Promise<unknown> {
    return this.financialSourcesPort.updateFinancialSource(userId, financialSourceId, input);
  }
}

import { Inject, Injectable } from '@nestjs/common';
import type {
  CreditDetailResponse,
  CreditsListResponse,
  CreditTimelineResponse,
} from '@dcredit/types';
import { APP_API_TOKENS } from '../../ports/app-api.tokens';
import { type CreditsReadPort } from '../../ports/auth.ports';

@Injectable()
export class ListCreditsUseCase {
  constructor(
    @Inject(APP_API_TOKENS.creditsReadPort)
    private readonly creditsReadPort: CreditsReadPort,
  ) {}

  execute(userId: string): Promise<CreditsListResponse> {
    return this.creditsReadPort.getCredits(userId);
  }
}

@Injectable()
export class GetCreditDetailUseCase {
  constructor(
    @Inject(APP_API_TOKENS.creditsReadPort)
    private readonly creditsReadPort: CreditsReadPort,
  ) {}

  execute(userId: string, creditId: string): Promise<CreditDetailResponse> {
    return this.creditsReadPort.getCreditDetails(userId, creditId);
  }
}

@Injectable()
export class GetCreditTimelineUseCase {
  constructor(
    @Inject(APP_API_TOKENS.creditsReadPort)
    private readonly creditsReadPort: CreditsReadPort,
  ) {}

  execute(userId: string): Promise<CreditTimelineResponse> {
    return this.creditsReadPort.getCreditTimeline(userId);
  }
}

import type { CreditsApiPort } from '../ports/app-api.ports';

export function loadCreditsUseCase(creditsApi: CreditsApiPort, token: string) {
  return creditsApi.getCredits(token);
}

export function loadCreditTimelineUseCase(creditsApi: CreditsApiPort, token: string) {
  return creditsApi.getCreditTimeline(token);
}

export function loadCreditDetailUseCase(
  creditsApi: CreditsApiPort,
  token: string,
  creditId: string,
) {
  return creditsApi.getCreditDetail(token, creditId);
}

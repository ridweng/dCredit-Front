import { appApiRoutes } from '@dcredit/core';
import { apiRequest } from './client';
import type { CreditsListResponse, CreditTimelineResponse } from '@/types/api';

export function getCredits(token: string) {
  return apiRequest<CreditsListResponse>(appApiRoutes.credits.list, {}, token);
}

export function getCreditTimeline(token: string) {
  return apiRequest<CreditTimelineResponse>(appApiRoutes.credits.timeline, {}, token);
}

import { appApiRoutes } from '@dcredit/core';
import { apiRequest } from './client';
import type {
  CreditDetailResponse,
  CreditsListResponse,
  CreditTimelineResponse,
} from '@/types/api';

export function getCredits() {
  return apiRequest<CreditsListResponse>(appApiRoutes.credits.list);
}

export function getCreditDetails(creditId: string) {
  return apiRequest<CreditDetailResponse>(appApiRoutes.credits.detail(creditId));
}

export function getCreditsTimeline() {
  return apiRequest<CreditTimelineResponse>(appApiRoutes.credits.timeline);
}

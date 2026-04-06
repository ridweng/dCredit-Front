import { apiRequest } from './client';
import type {
  CreditDetailResponse,
  CreditsListResponse,
  CreditTimelineResponse,
} from '@/types/api';

export function getCredits() {
  return apiRequest<CreditsListResponse>('/credits');
}

export function getCreditDetails(creditId: string) {
  return apiRequest<CreditDetailResponse>(`/credits/${creditId}`);
}

export function getCreditsTimeline() {
  return apiRequest<CreditTimelineResponse>('/credits/timeline');
}

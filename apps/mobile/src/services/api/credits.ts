import { apiRequest } from './client';
import type { CreditsListResponse, CreditTimelineResponse } from '@/types/api';

export function getCredits(token: string) {
  return apiRequest<CreditsListResponse>('/credits', {}, token);
}

export function getCreditTimeline(token: string) {
  return apiRequest<CreditTimelineResponse>('/credits/timeline', {}, token);
}

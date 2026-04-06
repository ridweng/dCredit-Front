import { apiRequest } from './client';
import type { SafeUser, UpdateCurrentUserInput } from '@/types/api';

export function getCurrentUser() {
  return apiRequest<SafeUser>('/users/me');
}

export function updateCurrentUser(body: UpdateCurrentUserInput) {
  return apiRequest<SafeUser>('/users/me', {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

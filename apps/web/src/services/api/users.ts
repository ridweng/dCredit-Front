import { appApiRoutes } from '@dcredit/core';
import { apiRequest } from './client';
import type { SafeUser, UpdateCurrentUserInput } from '@/types/api';

export function getCurrentUser() {
  return apiRequest<SafeUser>(appApiRoutes.users.me);
}

export function updateCurrentUser(body: UpdateCurrentUserInput) {
  return apiRequest<SafeUser>(appApiRoutes.users.me, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

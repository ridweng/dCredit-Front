import { appApiRoutes } from '@dcredit/core';
import { apiRequest } from './client';
import type { Locale } from '@dcredit/i18n';
import type { SafeUser } from '@/types/api';

export function getCurrentUser(token: string) {
  return apiRequest<SafeUser>(appApiRoutes.users.me, {}, token);
}

export function updateCurrentUser(token: string, preferredLanguage: Locale) {
  return apiRequest<SafeUser>(
    appApiRoutes.users.me,
    {
      method: 'PATCH',
      body: JSON.stringify({ preferredLanguage }),
    },
    token,
  );
}

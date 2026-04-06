import { apiRequest } from './client';
import type { Locale } from '@dcredit/i18n';
import type { LoginResponse, RegisterResponse } from '@/types/api';

export function login(email: string, password: string) {
  return apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function register(
  email: string,
  password: string,
  fullName: string,
  preferredLanguage: Locale,
) {
  return apiRequest<RegisterResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, fullName, preferredLanguage }),
  });
}

export function resendVerification(email: string) {
  return apiRequest<{ message: string }>('/auth/resend-verification', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export function getVerificationStatus(email: string) {
  return apiRequest<{ verified: boolean }>('/auth/verification-status', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

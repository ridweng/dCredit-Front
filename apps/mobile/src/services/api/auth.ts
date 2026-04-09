import { appApiRoutes } from '@dcredit/core';
import { apiRequest } from './client';
import type { Locale } from '@dcredit/i18n';
import type {
  LoginResponse,
  RegisterResponse,
  ResendVerificationResponse,
  VerificationStatusResponse,
} from '@/types/api';

export function login(email: string, password: string) {
  return apiRequest<LoginResponse>(appApiRoutes.auth.login, {
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
  return apiRequest<RegisterResponse>(appApiRoutes.auth.register, {
    method: 'POST',
    body: JSON.stringify({ email, password, fullName, preferredLanguage }),
  });
}

export function resendVerification(email: string) {
  return apiRequest<ResendVerificationResponse>(appApiRoutes.auth.resendVerification, {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export function getVerificationStatus(email: string) {
  return apiRequest<VerificationStatusResponse>(appApiRoutes.auth.verificationStatus, {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

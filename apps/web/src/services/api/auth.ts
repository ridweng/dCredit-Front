import { appApiRoutes } from '@dcredit/core';
import { apiRequest } from './client';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ResendVerificationResponse,
  VerifyEmailResponse,
} from '@/types/api';

export function login(body: LoginRequest) {
  return apiRequest<LoginResponse>(appApiRoutes.auth.login, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function register(body: RegisterRequest) {
  return apiRequest<RegisterResponse>(appApiRoutes.auth.register, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function verifyEmail(token: string) {
  return apiRequest<VerifyEmailResponse>(appApiRoutes.auth.verifyEmail, {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
}

export function resendVerification(email: string) {
  return apiRequest<ResendVerificationResponse>(appApiRoutes.auth.resendVerification, {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

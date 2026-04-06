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
  return apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function register(body: RegisterRequest) {
  return apiRequest<RegisterResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function verifyEmail(token: string) {
  return apiRequest<VerifyEmailResponse>('/auth/verify-email', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
}

export function resendVerification(email: string) {
  return apiRequest<ResendVerificationResponse>('/auth/resend-verification', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

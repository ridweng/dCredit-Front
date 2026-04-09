import type { LoginRequest, RegisterRequest, SafeUser } from '@dcredit/types';
import type { AuthApiPort, UsersApiPort } from '../ports/app-api.ports';
import type { SessionStoragePort } from '../ports/session-storage.port';
import type { ClientSession } from '../../domain/entities/session';

export async function loginWithSessionUseCase(
  authApi: AuthApiPort,
  sessionStorage: SessionStoragePort,
  input: LoginRequest,
): Promise<ClientSession> {
  const response = await authApi.login(input);
  await sessionStorage.setToken(response.accessToken);
  return {
    token: response.accessToken,
    user: response.user,
  };
}

export function registerUseCase(authApi: AuthApiPort, input: RegisterRequest) {
  return authApi.register(input);
}

export function verifyEmailUseCase(authApi: AuthApiPort, token: string) {
  return authApi.verifyEmail(token);
}

export function resendVerificationUseCase(authApi: AuthApiPort, email: string) {
  return authApi.resendVerification(email);
}

export function getVerificationStatusUseCase(authApi: AuthApiPort, email: string) {
  return authApi.getVerificationStatus(email);
}

export async function restoreSessionUseCase(
  usersApi: UsersApiPort,
  sessionStorage: SessionStoragePort,
): Promise<ClientSession | null> {
  const token = await sessionStorage.getToken();

  if (!token) {
    return null;
  }

  try {
    const user = await usersApi.getCurrentUser(token);
    return { token, user };
  } catch {
    await sessionStorage.clearToken();
    return null;
  }
}

export async function logoutUseCase(sessionStorage: SessionStoragePort): Promise<void> {
  await sessionStorage.clearToken();
}

export function updateCurrentUserLanguageUseCase(
  usersApi: UsersApiPort,
  token: string,
  preferredLanguage: SafeUser['preferredLanguage'],
) {
  return usersApi.updateCurrentUser(token, preferredLanguage);
}

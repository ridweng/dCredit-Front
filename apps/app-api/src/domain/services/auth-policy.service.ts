import type { AuthUserRecord, VerificationTokenRecord } from '../../application/ports/auth.ports';

export class AuthPolicyService {
  private static readonly VERIFICATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

  canReclaimExistingRegistration(user: Pick<AuthUserRecord, 'emailVerified' | 'isAdmin'>): boolean {
    return !user.emailVerified && !user.isAdmin;
  }

  isVerificationTokenUsable(
    token: Pick<VerificationTokenRecord, 'usedAt' | 'expiresAt'> | null,
    now: Date,
  ): boolean {
    return Boolean(token && !token.usedAt && token.expiresAt > now);
  }

  buildVerificationExpiry(now: Date): Date {
    return new Date(now.getTime() + AuthPolicyService.VERIFICATION_TOKEN_TTL_MS);
  }
}

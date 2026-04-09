import type {
  CreateFinancialSourceInput,
  DashboardSummaryResponse,
  FinancialSourcesResponse,
  LiquidBalanceResponse,
  SafeUser,
  SupportedLocale,
  WeeklySpendingResponse,
  CreditDetailResponse,
  CreditsListResponse,
  CreditTimelineResponse,
  UpdateFinancialSourceInput,
} from '@dcredit/types';

export interface AuthUserRecord {
  id: string;
  email: string;
  passwordHash: string;
  fullName: string;
  emailVerified: boolean;
  verifiedAt: Date | null;
  isAdmin: boolean;
  preferredLanguage: SupportedLocale;
  createdAt: Date;
  updatedAt: Date;
}

export interface VerificationTokenRecord {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  usedAt: Date | null;
  user?: AuthUserRecord;
}

export interface CreateAuthUserInput {
  email: string;
  passwordHash: string;
  fullName: string;
  preferredLanguage: SupportedLocale;
  isAdmin?: boolean;
}

export interface CreateVerificationTokenInput {
  userId: string;
  token: string;
  expiresAt: Date;
}

export interface AuthUsersPort {
  findById(id: string): Promise<AuthUserRecord | null>;
  findByEmail(email: string): Promise<AuthUserRecord | null>;
  createUser(input: CreateAuthUserInput): Promise<AuthUserRecord>;
  reclaimUnverifiedUser(existingUser: AuthUserRecord, input: CreateAuthUserInput): Promise<AuthUserRecord>;
  createVerificationToken(input: CreateVerificationTokenInput): Promise<VerificationTokenRecord>;
  findVerificationTokenWithUser(token: string): Promise<VerificationTokenRecord | null>;
  invalidateVerificationTokens(userId: string): Promise<void>;
  invalidateOtherVerificationTokens(userId: string, excludeTokenId: string, usedAt: Date): Promise<void>;
  markVerificationTokenUsed(tokenId: string, usedAt: Date): Promise<void>;
  markEmailVerified(userId: string, verifiedAt: Date): Promise<AuthUserRecord>;
  updatePreferredLanguage(userId: string, preferredLanguage: SupportedLocale): Promise<AuthUserRecord>;
}

export interface PasswordHasherPort {
  hash(password: string): Promise<string>;
  compare(plainText: string, passwordHash: string): Promise<boolean>;
}

export interface AccessTokenPayload {
  sub: string;
  email: string;
  emailVerified: boolean;
  isAdmin: boolean;
}

export interface AccessTokenPort {
  signAccessToken(payload: AccessTokenPayload): Promise<string>;
}

export interface VerificationMailerPort {
  sendVerificationEmail(input: {
    to: string;
    fullName: string;
    token: string;
  }): Promise<void>;
}

export interface ClockPort {
  now(): Date;
}

export interface DashboardReadPort {
  getSummary(userId: string): Promise<DashboardSummaryResponse>;
  getLiquidBalance(userId: string): Promise<LiquidBalanceResponse>;
  getWeeklySpending(userId: string): Promise<WeeklySpendingResponse>;
}

export interface CreditsReadPort {
  getCredits(userId: string): Promise<CreditsListResponse>;
  getCreditDetails(userId: string, creditId: string): Promise<CreditDetailResponse>;
  getCreditTimeline(userId: string): Promise<CreditTimelineResponse>;
}

export interface FinancialSourcesPort {
  getFinancialSources(userId: string): Promise<FinancialSourcesResponse>;
  createFinancialSource(userId: string, input: CreateFinancialSourceInput): Promise<unknown>;
  updateFinancialSource(
    userId: string,
    financialSourceId: string,
    input: UpdateFinancialSourceInput,
  ): Promise<unknown>;
}

export function toSafeUser(user: AuthUserRecord): SafeUser {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    emailVerified: user.emailVerified,
    preferredLanguage: user.preferredLanguage,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

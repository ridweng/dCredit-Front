import type { SupportedLocale } from '@dcredit/types';

export const activationStages = [
  'registered',
  'email_verified',
  'source_connected',
  'account_ready',
  'transaction_ready',
  'credit_ready',
  'activated',
] as const;

export type ActivationStage = (typeof activationStages)[number];

export interface AdminUserSummary {
  id: string;
  fullName: string;
  email: string;
  preferredLanguage: SupportedLocale;
  emailVerified: boolean;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
  activationStage: ActivationStage;
  financialSourceCount: number;
  accountCount: number;
  transactionCount: number;
  creditCount: number;
  lastActivityAt: Date | null;
}

export interface ActivationStepStatus {
  key: ActivationStage;
  label: string;
  completed: boolean;
}

export interface AdminUserDetail extends AdminUserSummary {
  counts: {
    verificationTokenCount: number;
    financialSourceCount: number;
    accountCount: number;
    transactionCount: number;
    creditCount: number;
  };
  journey: ActivationStepStatus[];
  financialSources: Array<Record<string, unknown>>;
  accounts: Array<Record<string, unknown>>;
  credits: Array<Record<string, unknown>>;
  recentTransactions: Array<Record<string, unknown>>;
}

export interface LatestVerification {
  id: string;
  verifiedAt: Date;
  user: {
    id: string;
    fullName: string;
    email: string;
  };
}

export interface ActivationFunnelEntry {
  key: ActivationStage;
  label: string;
  count: number;
  percentage: number;
}

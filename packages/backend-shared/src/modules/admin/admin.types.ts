import { PreferredLanguage } from '../../common/enums/preferred-language.enum';
import { FinancialSourceStatus } from '../../common/enums/financial-source-status.enum';
import { ProviderType } from '../../common/enums/provider-type.enum';
import { AccountType } from '../../common/enums/account-type.enum';
import { CreditType } from '../../common/enums/credit-type.enum';
import { TransactionType } from '../../common/enums/transaction-type.enum';

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
  preferredLanguage: PreferredLanguage;
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
  financialSources: Array<{
    id: string;
    providerName: string;
    providerType: ProviderType;
    status: FinancialSourceStatus;
    credentialReference: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
  accounts: Array<{
    id: string;
    accountName: string;
    accountType: AccountType;
    currency: string;
    currentBalance: number;
    availableBalance: number | null;
    financialSourceId: string;
    financialSourceName: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
  credits: Array<{
    id: string;
    name: string;
    creditType: CreditType;
    interestRate: number;
    monthlyPayment: number;
    outstandingBalance: number;
    nextPaymentDate: string;
    deferredPaymentDate: string | null;
    financialSourceId: string;
    financialSourceName: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
  recentTransactions: Array<{
    id: string;
    date: Date;
    description: string;
    amount: number;
    type: TransactionType;
    merchant: string | null;
    accountName: string;
    categoryName: string | null;
    creditName: string | null;
    createdAt: Date;
  }>;
}

export interface ActivationFunnelEntry {
  key: ActivationStage;
  label: string;
  count: number;
  percentage: number;
}

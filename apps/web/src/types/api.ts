import type { Locale } from '@dcredit/i18n';

export interface SafeUser {
  id: string;
  email: string;
  fullName: string;
  emailVerified: boolean;
  preferredLanguage: Locale;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  preferredLanguage: Locale;
}

export interface RegisterResponse {
  message: string;
  user: SafeUser;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: SafeUser;
}

export interface VerifyEmailResponse {
  message: string;
  user: SafeUser;
}

export interface ResendVerificationResponse {
  message: string;
}

export interface LiquidBalanceAccount {
  accountId: string;
  accountName: string;
  accountType: string;
  currency: string;
  currentBalance: number;
  availableBalance: number | null;
  liquidBalance: number;
}

export interface LiquidBalanceSource {
  financialSourceId: string;
  providerName: string;
  providerType: string;
  status: string;
  liquidBalance: number;
  accounts: LiquidBalanceAccount[];
}

export interface LiquidBalanceResponse {
  totalLiquidBalance: number;
  sourceCount: number;
  accountCount: number;
  sources: LiquidBalanceSource[];
}

export interface WeeklyGroupedDay {
  date: string;
  total: number;
}

export interface WeeklyGroupedCategory {
  categoryId: string | null;
  categoryKey: string;
  categoryName: string;
  total: number;
  transactionCount: number;
}

export interface WeeklySpendingResponse {
  referenceDate: string;
  currentWeek: {
    startDate: string;
    endDate: string;
    total: number;
    groupedByDay: WeeklyGroupedDay[];
    groupedByCategory: WeeklyGroupedCategory[];
  };
  previousWeek: {
    startDate: string;
    endDate: string;
    total: number;
  };
  comparison: {
    absoluteChange: number;
    percentageChange: number | null;
  };
}

export interface CategorySummaryResponse {
  totalClassifiedSpending: number;
  categories: Array<WeeklyGroupedCategory & { percentage: number }>;
}

export interface CreditObligation {
  creditId: string;
  name: string;
  amount: number;
  nextPaymentDate: string;
  deferredPaymentDate: string | null;
  effectiveDate: string;
  interestRate: number;
}

export interface DashboardSummaryResponse {
  overview: {
    accountCount: number;
    creditCount: number;
    totalOutstandingBalance: number;
  };
  liquidBalance: LiquidBalanceResponse;
  weeklySpending: WeeklySpendingResponse;
  categorizedSpending: CategorySummaryResponse;
  creditObligations: {
    totalMonthlyPayment: number;
    nextPaymentDate: string | null;
    nextUpcomingPayment: CreditObligation | null;
    highInterestCredits: Array<{
      id: string;
      name: string;
      creditType: string;
      interestRate: number;
      outstandingBalance: number;
      monthlyPayment: number;
    }>;
  };
}

export interface CreditsListResponse {
  summary: {
    totalCredits: number;
    totalOutstandingBalance: number;
    totalMonthlyPayment: number;
    nextUpcomingPayment: CreditObligation | null;
    highInterestCount: number;
  };
  credits: Array<{
    id: string;
    name: string;
    creditType: string;
    originalAmount: number;
    outstandingBalance: number;
    interestRate: number;
    monthlyPayment: number;
    nextPaymentDate: string;
    deferredPaymentDate: string | null;
    totalInstallments: number | null;
    remainingInstallments: number | null;
    highInterest: boolean;
    financialSource: {
      id: string;
      providerName: string;
      providerType: string;
    };
  }>;
}

export interface CreditTimelineResponse {
  timelineRange: {
    startDate: string | null;
    endDate: string | null;
  };
  credits: Array<{
    creditId: string;
    name: string;
    creditType: string;
    interestRate: number;
    monthlyPayment: number;
    outstandingBalance: number;
    financialSource: {
      id: string;
      providerName: string;
      providerType: string;
    } | null;
    startDate: string;
    endDate: string;
    items: Array<{
      installmentId: string;
      installmentNumber: number;
      dueDate: string;
      amount: number;
      principalPortion: number | null;
      interestPortion: number | null;
      status: string;
    }>;
  }>;
}

export interface CreditDetailResponse {
  credit: {
    id: string;
    name: string;
    creditType: string;
    originalAmount: number;
    outstandingBalance: number;
    interestRate: number;
    monthlyPayment: number;
    nextPaymentDate: string;
    deferredPaymentDate: string | null;
    effectiveNextPaymentDate: string;
    totalInstallments: number | null;
    remainingInstallments: number | null;
    financialSource: {
      id: string;
      providerName: string;
      providerType: string;
      status: string;
    };
    installments: Array<{
      id: string;
      installmentNumber: number;
      dueDate: string;
      amount: number;
      principalPortion: number | null;
      interestPortion: number | null;
      status: string;
    }>;
    timeline: CreditTimelineResponse['credits'][number] | null;
  };
}

export interface RecentTransactionsResponse {
  transactions: Array<{
    id: string;
    date: string;
    description: string;
    amount: number;
    type: string;
    merchant: string | null;
    createdAt: string;
    account: {
      id: string;
      accountName: string;
      accountType: string;
      currency: string;
      financialSource: {
        id: string;
        providerName: string;
        providerType: string;
      };
    };
    credit: {
      id: string;
      name: string;
      interestRate: number;
    } | null;
    category: {
      id: string;
      key: string;
      name: string;
      type: string;
    } | null;
  }>;
}

export interface FinancialSourcesResponse {
  financialSources: Array<{
    id: string;
    providerName: string;
    providerType: string;
    status: string;
    credentialReference: string;
    accountCount: number;
    creditCount: number;
    liquidBalance: number;
    outstandingCreditBalance: number;
    accounts: Array<{
      id: string;
      accountName: string;
      accountType: string;
      currency: string;
      currentBalance: number;
      availableBalance: number | null;
    }>;
  }>;
}

export interface CreateFinancialSourceInput {
  providerName: string;
  providerType: string;
  status: string;
  credentialReference: string;
}

export interface UpdateFinancialSourceInput {
  providerName?: string;
  providerType?: string;
  status?: string;
  credentialReference?: string;
}

export interface UpdateCurrentUserInput {
  preferredLanguage: Locale;
}

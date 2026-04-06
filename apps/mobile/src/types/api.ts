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

export interface LoginResponse {
  accessToken: string;
  user: SafeUser;
}

export interface RegisterResponse {
  message: string;
  user: SafeUser;
}

export interface DashboardSummaryResponse {
  overview: {
    accountCount: number;
    creditCount: number;
    totalOutstandingBalance: number;
  };
  liquidBalance: {
    totalLiquidBalance: number;
    sourceCount: number;
    accountCount: number;
    sources: Array<{
      financialSourceId: string;
      providerName: string;
      providerType: string;
      status: string;
      liquidBalance: number;
      accounts: Array<{
        accountId: string;
        accountName: string;
        accountType: string;
        currency: string;
        liquidBalance: number;
      }>;
    }>;
  };
  weeklySpending: {
    currentWeek: {
      total: number;
      groupedByDay: Array<{ date: string; total: number }>;
      groupedByCategory: Array<{
        categoryKey: string;
        categoryName: string;
        total: number;
        transactionCount: number;
      }>;
    };
    previousWeek: {
      total: number;
    };
    comparison: {
      percentageChange: number | null;
    };
  };
  categorizedSpending: {
    totalClassifiedSpending: number;
    categories: Array<{
      categoryKey: string;
      categoryName: string;
      total: number;
      percentage: number;
      transactionCount: number;
    }>;
  };
  creditObligations: {
    totalMonthlyPayment: number;
    nextPaymentDate: string | null;
    nextUpcomingPayment: {
      creditId: string;
      name: string;
      amount: number;
      nextPaymentDate: string;
      deferredPaymentDate: string | null;
      effectiveDate: string;
      interestRate: number;
    } | null;
    highInterestCredits: Array<{
      id: string;
      name: string;
      interestRate: number;
      monthlyPayment: number;
      outstandingBalance: number;
    }>;
  };
}

export interface CreditsListResponse {
  summary: {
    totalCredits: number;
    totalOutstandingBalance: number;
    totalMonthlyPayment: number;
    nextUpcomingPayment: {
      creditId: string;
      name: string;
      amount: number;
      effectiveDate: string;
    } | null;
    highInterestCount: number;
  };
  credits: Array<{
    id: string;
    name: string;
    creditType: string;
    outstandingBalance: number;
    interestRate: number;
    monthlyPayment: number;
    nextPaymentDate: string;
    deferredPaymentDate: string | null;
    totalInstallments: number | null;
    remainingInstallments: number | null;
    highInterest: boolean;
    financialSource: {
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
    interestRate: number;
    monthlyPayment: number;
    outstandingBalance: number;
    items: Array<{
      installmentId: string;
      installmentNumber: number;
      dueDate: string;
      amount: number;
      status: string;
    }>;
  }>;
}

export interface WeeklySpendingResponse {
  currentWeek: {
    total: number;
    groupedByDay: Array<{ date: string; total: number }>;
  };
  previousWeek: {
    total: number;
  };
  comparison: {
    percentageChange: number | null;
  };
}

export interface CategorySummaryResponse {
  totalClassifiedSpending: number;
  categories: Array<{
    categoryKey: string;
    categoryName: string;
    total: number;
    percentage: number;
    transactionCount: number;
  }>;
}

export interface RecentTransactionsResponse {
  transactions: Array<{
    id: string;
    date: string;
    description: string;
    amount: number;
    merchant: string | null;
    account: {
      accountName: string;
      currency: string;
    };
    category: {
      key: string;
      name: string;
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
  }>;
}

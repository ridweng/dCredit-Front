import { appApiRoutes, buildTransactionsPath } from '@dcredit/core';
import type {
  CreateFinancialSourceInput,
  CreditDetailResponse,
  CreditsListResponse,
  CreditTimelineResponse,
  DashboardSummaryResponse,
  FinancialSourcesResponse,
  LoginRequest,
  LoginResponse,
  RecentTransactionsQuery,
  RecentTransactionsResponse,
  RegisterRequest,
  RegisterResponse,
  ResendVerificationResponse,
  SafeUser,
  SupportedLocale,
  UpdateFinancialSourceInput,
  VerificationStatusResponse,
  VerifyEmailResponse,
  WeeklySpendingResponse,
  CategorySummaryResponse,
} from '@dcredit/types';
import type {
  AuthApiPort,
  CreditsApiPort,
  DashboardApiPort,
  FinancialSourcesApiPort,
  TransactionsApiPort,
  UsersApiPort,
} from '../../application/ports/app-api.ports';

export interface RequestAdapter {
  request<T>(
    path: string,
    options?: RequestInit & { token?: string | null },
  ): Promise<T>;
}

export function createAppApiPorts(requestAdapter: RequestAdapter): {
  authApi: AuthApiPort;
  usersApi: UsersApiPort;
  dashboardApi: DashboardApiPort;
  creditsApi: CreditsApiPort;
  transactionsApi: TransactionsApiPort;
  financialSourcesApi: FinancialSourcesApiPort;
} {
  const authApi: AuthApiPort = {
    login(input: LoginRequest): Promise<LoginResponse> {
      return requestAdapter.request(appApiRoutes.auth.login, {
        method: 'POST',
        body: JSON.stringify(input),
      });
    },
    register(input: RegisterRequest): Promise<RegisterResponse> {
      return requestAdapter.request(appApiRoutes.auth.register, {
        method: 'POST',
        body: JSON.stringify(input),
      });
    },
    verifyEmail(token: string): Promise<VerifyEmailResponse> {
      return requestAdapter.request(appApiRoutes.auth.verifyEmail, {
        method: 'POST',
        body: JSON.stringify({ token }),
      });
    },
    resendVerification(email: string): Promise<ResendVerificationResponse> {
      return requestAdapter.request(appApiRoutes.auth.resendVerification, {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
    },
    getVerificationStatus(email: string): Promise<VerificationStatusResponse> {
      return requestAdapter.request(appApiRoutes.auth.verificationStatus, {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
    },
  };

  const usersApi: UsersApiPort = {
    getCurrentUser(token: string): Promise<SafeUser> {
      return requestAdapter.request(appApiRoutes.users.me, { token });
    },
    updateCurrentUser(token: string, preferredLanguage: SupportedLocale): Promise<SafeUser> {
      return requestAdapter.request(appApiRoutes.users.me, {
        method: 'PATCH',
        body: JSON.stringify({ preferredLanguage }),
        token,
      });
    },
  };

  const dashboardApi: DashboardApiPort = {
    getSummary(token: string): Promise<DashboardSummaryResponse> {
      return requestAdapter.request(appApiRoutes.dashboard.summary, { token });
    },
    getWeeklySpending(token: string): Promise<WeeklySpendingResponse> {
      return requestAdapter.request(appApiRoutes.dashboard.weeklySpending, { token });
    },
  };

  const creditsApi: CreditsApiPort = {
    getCredits(token: string): Promise<CreditsListResponse> {
      return requestAdapter.request(appApiRoutes.credits.list, { token });
    },
    getCreditTimeline(token: string): Promise<CreditTimelineResponse> {
      return requestAdapter.request(appApiRoutes.credits.timeline, { token });
    },
    getCreditDetail(token: string, creditId: string): Promise<CreditDetailResponse> {
      return requestAdapter.request(appApiRoutes.credits.detail(creditId), { token });
    },
  };

  const transactionsApi: TransactionsApiPort = {
    getCategoriesSummary(token: string): Promise<CategorySummaryResponse> {
      return requestAdapter.request(appApiRoutes.transactions.categoriesSummary, { token });
    },
    getRecentTransactions(
      token: string,
      params?: RecentTransactionsQuery,
    ): Promise<RecentTransactionsResponse> {
      return requestAdapter.request(buildTransactionsPath(params), { token });
    },
  };

  const financialSourcesApi: FinancialSourcesApiPort = {
    getFinancialSources(token: string): Promise<FinancialSourcesResponse> {
      return requestAdapter.request(appApiRoutes.financialSources.list, { token });
    },
    createFinancialSource(token: string, input: CreateFinancialSourceInput): Promise<unknown> {
      return requestAdapter.request(appApiRoutes.financialSources.list, {
        method: 'POST',
        body: JSON.stringify(input),
        token,
      });
    },
    updateFinancialSource(
      token: string,
      financialSourceId: string,
      input: UpdateFinancialSourceInput,
    ): Promise<unknown> {
      return requestAdapter.request(appApiRoutes.financialSources.detail(financialSourceId), {
        method: 'PATCH',
        body: JSON.stringify(input),
        token,
      });
    },
  };

  return {
    authApi,
    usersApi,
    dashboardApi,
    creditsApi,
    transactionsApi,
    financialSourcesApi,
  };
}

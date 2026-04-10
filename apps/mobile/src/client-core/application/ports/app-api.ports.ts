import type {
  CategorySummaryResponse,
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
} from '@dcredit/types';

export interface AuthApiPort {
  login(input: LoginRequest): Promise<LoginResponse>;
  register(input: RegisterRequest): Promise<RegisterResponse>;
  verifyEmail(token: string): Promise<VerifyEmailResponse>;
  resendVerification(email: string): Promise<ResendVerificationResponse>;
  getVerificationStatus(email: string): Promise<VerificationStatusResponse>;
}

export interface UsersApiPort {
  getCurrentUser(token: string): Promise<SafeUser>;
  updateCurrentUser(token: string, preferredLanguage: SupportedLocale): Promise<SafeUser>;
}

export interface DashboardApiPort {
  getSummary(token: string): Promise<DashboardSummaryResponse>;
  getWeeklySpending(token: string): Promise<WeeklySpendingResponse>;
}

export interface CreditsApiPort {
  getCredits(token: string): Promise<CreditsListResponse>;
  getCreditTimeline(token: string): Promise<CreditTimelineResponse>;
  getCreditDetail(token: string, creditId: string): Promise<CreditDetailResponse>;
}

export interface TransactionsApiPort {
  getCategoriesSummary(token: string): Promise<CategorySummaryResponse>;
  getRecentTransactions(
    token: string,
    params?: RecentTransactionsQuery,
  ): Promise<RecentTransactionsResponse>;
}

export interface FinancialSourcesApiPort {
  getFinancialSources(token: string): Promise<FinancialSourcesResponse>;
  createFinancialSource(token: string, input: CreateFinancialSourceInput): Promise<unknown>;
  updateFinancialSource(
    token: string,
    financialSourceId: string,
    input: UpdateFinancialSourceInput,
  ): Promise<unknown>;
}

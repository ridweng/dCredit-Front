import type { RecentTransactionsQuery } from '@dcredit/types';

export const APP_API_PREFIX = '/api';

export const appApiRoutes = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    verifyEmail: '/auth/verify-email',
    resendVerification: '/auth/resend-verification',
    verificationStatus: '/auth/verification-status',
  },
  users: {
    me: '/users/me',
  },
  dashboard: {
    summary: '/dashboard/summary',
    liquidBalance: '/dashboard/liquid-balance',
    weeklySpending: '/dashboard/weekly-spending',
  },
  credits: {
    list: '/credits',
    detail: (creditId: string) => `/credits/${creditId}`,
    timeline: '/credits/timeline',
  },
  transactions: {
    list: '/transactions',
    categoriesSummary: '/transactions/categories-summary',
  },
  financialSources: {
    list: '/financial-sources',
    detail: (financialSourceId: string) => `/financial-sources/${financialSourceId}`,
  },
} as const;

export function buildAppApiUrl(baseUrl: string | undefined, path: string) {
  const origin = baseUrl?.replace(/\/+$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return origin ? `${origin}${APP_API_PREFIX}${normalizedPath}` : `${APP_API_PREFIX}${normalizedPath}`;
}

export function extractApiErrorMessage(data: unknown, fallback = 'Request failed') {
  if (typeof data === 'object' && data !== null && 'message' in data) {
    return String((data as { message: unknown }).message);
  }

  return fallback;
}

export function buildTransactionsPath(params: RecentTransactionsQuery = {}) {
  const search = new URLSearchParams();

  if (params.limit) {
    search.set('limit', String(params.limit));
  }

  if (params.categoryKey) {
    search.set('categoryKey', params.categoryKey);
  }

  return search.size > 0
    ? `${appApiRoutes.transactions.list}?${search.toString()}`
    : appApiRoutes.transactions.list;
}

import {
  createAppApiPorts,
  type RequestAdapter,
  type SessionStoragePort,
} from '@dcredit/client-core';
import { apiRequest, TOKEN_STORAGE_KEY } from '@/services/api/client';

const requestAdapter: RequestAdapter = {
  request<T>(path: string, options: RequestInit & { token?: string | null } = {}) {
    return apiRequest<T>(path, options);
  },
};

export const webSessionStoragePort: SessionStoragePort = {
  async getToken() {
    return window.localStorage.getItem(TOKEN_STORAGE_KEY);
  },
  async setToken(token: string) {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
  },
  async clearToken() {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  },
};

export const {
  authApi,
  usersApi,
  dashboardApi,
  creditsApi,
  transactionsApi,
  financialSourcesApi,
} = createAppApiPorts(requestAdapter);

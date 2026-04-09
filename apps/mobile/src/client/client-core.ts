import {
  createAppApiPorts,
  type RequestAdapter,
  type SessionStoragePort,
} from '@dcredit/client-core';
import { apiRequest } from './request';
import {
  clearStoredToken,
  getStoredToken,
  setStoredToken,
} from '@/services/storage/deviceStorage';

const requestAdapter: RequestAdapter = {
  request<T>(path: string, options: RequestInit & { token?: string | null } = {}) {
    return apiRequest<T>(path, options, options.token);
  },
};

export const mobileSessionStoragePort: SessionStoragePort = {
  getToken() {
    return getStoredToken();
  },
  setToken(token: string) {
    return setStoredToken(token);
  },
  clearToken() {
    return clearStoredToken();
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

import {
  buildAppApiUrl,
  extractApiErrorMessage,
  FRONTEND_STORAGE_KEYS,
} from '@dcredit/core';

export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

const API_ORIGIN = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, '');
const TOKEN_STORAGE_KEY = FRONTEND_STORAGE_KEYS.webToken;

function getStoredToken() {
  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
}

export interface ApiRequestOptions extends RequestInit {
  token?: string | null;
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  const token = options.token ?? getStoredToken();

  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let response: Response;

  try {
    response = await fetch(buildAppApiUrl(API_ORIGIN, path), {
      ...options,
      headers,
    });
  } catch (error) {
    throw new ApiError(
      'Unable to reach the API. Check that the Nest server is running and VITE_API_URL is correct.',
      0,
      error,
    );
  }

  const contentType = response.headers.get('content-type');
  const isJson = contentType?.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message = extractApiErrorMessage(data, response.statusText || 'Request failed');

    throw new ApiError(message, response.status, data);
  }

  return data as T;
}

export { TOKEN_STORAGE_KEY };

import Constants from 'expo-constants';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// Note:
// `localhost` usually does not work on a physical device and may not work on every emulator.
// For real native testing, point this to your machine LAN IP, use Expo tunnel, or Android reverse proxying.
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  Constants.expoConfig?.extra?.apiUrl ||
  'http://localhost:3001';

function buildUrl(path: string) {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL.replace(/\/+$/, '')}/api${normalized}`;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null,
): Promise<T> {
  const headers = new Headers(options.headers);

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(buildUrl(path), {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type') ?? '';
  const data = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof data === 'object' && data !== null && 'message' in data
        ? String((data as { message: unknown }).message)
        : 'Request failed';

    throw new ApiError(message, response.status);
  }

  return data as T;
}

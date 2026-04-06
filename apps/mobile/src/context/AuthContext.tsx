import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { SafeUser } from '@/types/api';
import {
  clearStoredToken,
  getStoredToken,
  setStoredToken,
} from '@/services/storage/deviceStorage';
import { getCurrentUser } from '@/services/api/users';

interface AuthContextValue {
  user: SafeUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string, user: SafeUser) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: SafeUser) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<SafeUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    void (async () => {
      const storedToken = await getStoredToken();

      if (!storedToken) {
        if (mounted) {
          setIsLoading(false);
        }
        return;
      }

      try {
        const currentUser = await getCurrentUser(storedToken);

        if (mounted) {
          setToken(storedToken);
          setUser(currentUser);
        }
      } catch {
        await clearStoredToken();
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: Boolean(user && token),
      login: async (nextToken, nextUser) => {
        await setStoredToken(nextToken);
        setToken(nextToken);
        setUser(nextUser);
      },
      logout: async () => {
        await clearStoredToken();
        setToken(null);
        setUser(null);
      },
      updateUser: (nextUser) => {
        setUser(nextUser);
      },
    }),
    [isLoading, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { TOKEN_STORAGE_KEY } from '@/services/api/client';
import { getCurrentUser } from '@/services/api/users';
import type { SafeUser } from '@/types/api';

interface AuthContextValue {
  user: SafeUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: SafeUser) => void;
  logout: () => void;
  updateUser: (user: SafeUser) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => window.localStorage.getItem(TOKEN_STORAGE_KEY));
  const [user, setUser] = useState<SafeUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    let active = true;

    async function rehydrateSession() {
      if (!token) {
        if (active) {
          setUser(null);
          setIsLoading(false);
        }
        return;
      }

      try {
        const currentUser = await getCurrentUser();
        if (active) {
          setUser(currentUser);
        }
      } catch {
        if (active) {
          logout();
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void rehydrateSession();

    return () => {
      active = false;
    };
  }, [logout, token]);

  const login = useCallback((nextToken: string, nextUser: SafeUser) => {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, nextToken);
    setToken(nextToken);
    setUser(nextUser);
    setIsLoading(false);
  }, []);

  const updateUser = useCallback((nextUser: SafeUser) => {
    setUser(nextUser);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      isLoading,
      login,
      logout,
      updateUser,
    }),
    [isLoading, login, logout, token, updateUser, user],
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

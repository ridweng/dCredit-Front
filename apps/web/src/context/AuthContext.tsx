import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { logoutUseCase, restoreSessionUseCase } from '@dcredit/client-core';
import { usersApi, webSessionStoragePort } from '@/client/client-core';
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
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<SafeUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    void logoutUseCase(webSessionStoragePort);
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    let active = true;

    async function rehydrateSession() {
      try {
        const session = await restoreSessionUseCase(usersApi, webSessionStoragePort);
        if (active) {
          setToken(session?.token ?? null);
          setUser(session?.user ?? null);
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
  }, [logout]);

  const login = useCallback((nextToken: string, nextUser: SafeUser) => {
    void webSessionStoragePort.setToken(nextToken);
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

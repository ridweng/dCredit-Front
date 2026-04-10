import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { logoutUseCase, restoreSessionUseCase } from '@/client-core';
import type { SafeUser } from '@/types/api';
import { mobileSessionStoragePort, usersApi } from '@/client/client-core';

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
      try {
        const session = await restoreSessionUseCase(usersApi, mobileSessionStoragePort);

        if (mounted) {
          setToken(session?.token ?? null);
          setUser(session?.user ?? null);
        }
      } catch {
        await logoutUseCase(mobileSessionStoragePort);
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
        await mobileSessionStoragePort.setToken(nextToken);
        setToken(nextToken);
        setUser(nextUser);
      },
      logout: async () => {
        await logoutUseCase(mobileSessionStoragePort);
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

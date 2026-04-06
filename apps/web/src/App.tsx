import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';
import { AppShell } from '@/components/AppShell';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PublicOnlyRoute } from '@/components/PublicOnlyRoute';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { LanguageProvider, useLanguage } from '@/context/LanguageContext';
import { CreditsPage } from '@/pages/CreditsPage';
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/LoginPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { RegisterPage } from '@/pages/RegisterPage';
import { SourcesPage } from '@/pages/SourcesPage';
import { SpendingPage } from '@/pages/SpendingPage';
import { VerifyEmailPage } from '@/pages/VerifyEmailPage';

const queryClient = new QueryClient();

function AuthLanguageSync() {
  const { user } = useAuth();
  const { locale, setLocale } = useLanguage();

  useEffect(() => {
    if (user?.preferredLanguage && user.preferredLanguage !== locale) {
      setLocale(user.preferredLanguage);
    }
  }, [locale, setLocale, user?.preferredLanguage]);

  return null;
}

function AppRoutes() {
  return (
    <>
      <AuthLanguageSync />
      <Routes>
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/credits" element={<CreditsPage />} />
            <Route path="/credits/:creditId" element={<CreditsPage />} />
            <Route path="/spending" element={<SpendingPage />} />
            <Route path="/sources" element={<SourcesPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        <Route path="/web" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;

import { useMutation } from '@tanstack/react-query';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { login } from '@/services/api/auth';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login: persistLogin } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState('demo@dcredit.local');
  const [password, setPassword] = useState('ChangeMe123!');
  const [error, setError] = useState<string | null>(null);

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      persistLogin(response.accessToken, response.user);
      const destination = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/';
      navigate(destination, { replace: true });
    },
    onError: (mutationError: Error) => {
      setError(mutationError.message || t('messages.loginFailed'));
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(29,170,163,0.18),_transparent_32%),linear-gradient(180deg,_rgba(255,255,255,0.95),_rgba(243,248,248,1))] p-4">
      <Card className="w-full max-w-5xl overflow-hidden p-0">
        <div className="grid md:grid-cols-[1.05fr_0.95fr]">
          <div className="bg-primary px-8 py-10 text-primary-foreground md:px-10 md:py-14">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold">{t('app.brand')}</p>
                <p className="mt-2 max-w-sm text-sm text-primary-foreground/85">{t('app.tagline')}</p>
              </div>
            </div>

            <div className="mt-16 space-y-6">
              <div className="space-y-2">
                <p className="text-4xl font-semibold leading-tight">{t('auth.login.title')}</p>
                <p className="max-w-md text-sm text-primary-foreground/80">{t('auth.login.subtitle')}</p>
              </div>
              <div className="rounded-3xl border border-white/20 bg-white/10 p-5 text-sm text-primary-foreground/90">
                <p className="font-medium">{t('auth.login.demoHint')}</p>
                <p className="mt-2">demo@dcredit.local / ChangeMe123!</p>
              </div>
            </div>
          </div>

          <div className="px-6 py-10 md:px-10 md:py-14">
            <div className="mx-auto max-w-md space-y-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold">{t('auth.login.title')}</h1>
                <p className="text-sm text-muted-foreground">{t('auth.login.subtitle')}</p>
              </div>

              <form
                className="space-y-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  setError(null);
                  loginMutation.mutate({ email, password });
                }}
              >
                <label className="block space-y-2">
                  <span className="text-sm font-medium">{t('common.email')}</span>
                  <Input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    required
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-medium">{t('common.password')}</span>
                  <Input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    required
                  />
                </label>

                {error ? (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {error}
                  </div>
                ) : null}

                <Button className="w-full" type="submit" disabled={loginMutation.isPending}>
                  {t('auth.login.submit')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>

              {/* <div className="flex items-center gap-3 rounded-2xl border border-border bg-muted/60 px-4 py-3 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <span>
                  {t('actions.openMailpit')}:{' '}
                  <a className="font-medium text-primary" href="http://localhost:8025" target="_blank" rel="noreferrer">
                    http://localhost:8025
                  </a>
                </span>
              </div> */}

              <p className="text-sm text-muted-foreground">
                {t('auth.login.noAccount')}{' '}
                <Link className="font-medium text-primary" to="/register">
                  {t('auth.login.signUp')}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

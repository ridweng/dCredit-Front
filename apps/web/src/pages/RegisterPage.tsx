import { useMutation } from '@tanstack/react-query';
import { registerUseCase } from '@dcredit/client-core';
import { CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '@/client/client-core';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/context/LanguageContext';

export function RegisterPage() {
  const { t } = useLanguage();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const registerMutation = useMutation({
    mutationFn: (input: {
      email: string;
      password: string;
      fullName: string;
      preferredLanguage: 'es' | 'en';
    }) => registerUseCase(authApi, input),
    onSuccess: (response) => {
      setSuccessMessage(response.message);
      setError(null);
    },
    onError: (mutationError: Error) => {
      setError(mutationError.message || t('messages.registerFailed'));
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-xl space-y-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-2xl font-semibold">{t('auth.register.title')}</p>
            <p className="mt-2 text-sm text-muted-foreground">{t('auth.register.subtitle')}</p>
          </div>
        </div>

        {successMessage ? (
          <div className="space-y-4 rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
            <div className="flex items-center gap-3 text-emerald-700">
              <CheckCircle2 className="h-5 w-5" />
              <p className="font-semibold">{t('auth.register.successTitle')}</p>
            </div>
            <p className="text-sm leading-6 text-emerald-900">{t('auth.register.successBody')}</p>
            <p className="text-sm text-emerald-700">{successMessage}</p>
            <div className="flex flex-wrap gap-3">
              {/* <a className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-background px-4 text-sm font-medium text-foreground" href="http://localhost:8025" target="_blank" rel="noreferrer">
                {t('actions.openMailpit')}
              </a> */}
              <Link className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground" to="/login">
                {t('auth.register.goToLogin')}
              </Link>
            </div>
          </div>
        ) : (
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              setError(null);
              registerMutation.mutate({
                email,
                password,
                fullName,
                preferredLanguage: 'es',
              });
            }}
          >
            <label className="block space-y-2">
              <span className="text-sm font-medium">{t('common.fullName')}</span>
              <Input value={fullName} onChange={(event) => setFullName(event.target.value)} required />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium">{t('common.email')}</span>
              <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium">{t('common.password')}</span>
              <Input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={8}
                required
              />
            </label>

            {error ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            ) : null}

            <Button className="w-full" type="submit" disabled={registerMutation.isPending}>
              {t('auth.register.submit')}
            </Button>
          </form>
        )}

        <p className="text-sm text-muted-foreground">
          {t('auth.register.hasAccount')}{' '}
          <Link className="font-medium text-primary" to="/login">
            {t('auth.register.signIn')}
          </Link>
        </p>
      </Card>
    </div>
  );
}

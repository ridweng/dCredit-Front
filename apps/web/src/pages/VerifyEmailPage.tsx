import { useMutation } from '@tanstack/react-query';
import { CheckCircle2, Loader2, RefreshCcw, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/context/LanguageContext';
import { resendVerification, verifyEmail } from '@/services/api/auth';

export function VerifyEmailPage() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const verifyMutation = useMutation({
    mutationFn: verifyEmail,
    onSuccess: (response) => {
      setStatus('success');
      setMessage(response.message);
    },
    onError: (mutationError: Error) => {
      setStatus('error');
      setMessage(mutationError.message || t('auth.verify.error'));
    },
  });

  const resendMutation = useMutation({
    mutationFn: resendVerification,
    onSuccess: (response) => {
      setMessage(response.message);
    },
    onError: (mutationError: Error) => {
      setMessage(mutationError.message);
    },
  });

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage(t('auth.verify.noToken'));
      return;
    }

    verifyMutation.mutate(token);
  }, [searchParams, t]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg space-y-6 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          {status === 'verifying' ? (
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
          ) : null}
          {status === 'success' ? <CheckCircle2 className="h-7 w-7 text-emerald-600" /> : null}
          {status === 'error' ? <XCircle className="h-7 w-7 text-rose-600" /> : null}
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-semibold">{t('auth.verify.title')}</h1>
          <p className="text-sm text-muted-foreground">
            {status === 'verifying'
              ? t('auth.verify.verifying')
              : status === 'success'
                ? t('auth.verify.success')
                : t('auth.verify.error')}
          </p>
          {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
        </div>

        {status === 'error' ? (
          <div className="space-y-4 rounded-3xl border border-border bg-muted/40 p-5 text-left">
            <div>
              <h2 className="font-semibold">{t('auth.verify.resendTitle')}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{t('messages.verificationResent')}</p>
            </div>
            <form
              className="space-y-3"
              onSubmit={(event) => {
                event.preventDefault();
                resendMutation.mutate(email);
              }}
            >
              <Input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={t('common.email')}
                required
              />
              <Button className="w-full" disabled={resendMutation.isPending} type="submit">
                <RefreshCcw className="mr-2 h-4 w-4" />
                {t('auth.verify.resendSubmit')}
              </Button>
            </form>
          </div>
        ) : null}

        <div className="flex justify-center gap-3">
          <Link className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-background px-4 text-sm font-medium text-foreground" to="/login">
            {t('auth.verify.backToLogin')}
          </Link>
        </div>
      </Card>
    </div>
  );
}

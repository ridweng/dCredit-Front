import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createFinancialSourceUseCase,
  loadFinancialSourcesUseCase,
  updateFinancialSourceUseCase,
} from '@dcredit/client-core';
import { ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { financialSourcesApi } from '@/client/client-core';
import { ErrorState } from '@/components/ErrorState';
import { LoadingState } from '@/components/LoadingState';
import { PageHeader } from '@/components/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { formatCurrency } from '@/lib/utils';

const providerTypes = ['bank_api', 'manual', 'csv', 'open_banking'] as const;
const statusTypes = ['active', 'pending', 'error', 'disconnected'] as const;

export function SourcesPage() {
  const { token } = useAuth();
  const { locale, t } = useLanguage();
  const queryClient = useQueryClient();
  const [providerName, setProviderName] = useState('');
  const [providerType, setProviderType] = useState<(typeof providerTypes)[number]>('manual');
  const [status, setStatus] = useState<(typeof statusTypes)[number]>('pending');
  const [credentialReference, setCredentialReference] = useState('vault://sources/manual/demo-user');
  const [message, setMessage] = useState<string | null>(null);

  const sourcesQuery = useQuery({
    queryKey: ['financial-sources'],
    queryFn: () => loadFinancialSourcesUseCase(financialSourcesApi, token!),
    enabled: Boolean(token),
  });

  const createMutation = useMutation({
    mutationFn: (input: {
      providerName: string;
      providerType: (typeof providerTypes)[number];
      status: (typeof statusTypes)[number];
      credentialReference: string;
    }) => createFinancialSourceUseCase(financialSourcesApi, token!, input),
    onSuccess: () => {
      setMessage(t('messages.sourceCreated'));
      setProviderName('');
      void queryClient.invalidateQueries({ queryKey: ['financial-sources'] });
    },
    onError: (error: Error) => {
      setMessage(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, nextStatus }: { id: string; nextStatus: string }) =>
      updateFinancialSourceUseCase(financialSourcesApi, token!, id, { status: nextStatus }),
    onSuccess: () => {
      setMessage(t('messages.sourceUpdated'));
      void queryClient.invalidateQueries({ queryKey: ['financial-sources'] });
    },
    onError: (error: Error) => {
      setMessage(error.message);
    },
  });

  if (sourcesQuery.isLoading) {
    return <LoadingState />;
  }

  if (sourcesQuery.isError || !sourcesQuery.data) {
    return <ErrorState onRetry={() => sourcesQuery.refetch()} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader title={t('sources.title')} subtitle={t('sources.subtitle')} />

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <Card className="space-y-3 border-primary/20 bg-primary/5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-primary">{t('sources.vaultTitle')}</h2>
                <p className="text-sm text-foreground/80">{t('sources.vaultBody')}</p>
              </div>
            </div>
          </Card>

          <Card className="space-y-4">
            <h2 className="text-lg font-semibold">{t('sources.addTitle')}</h2>
            <form
              className="space-y-3"
              onSubmit={(event) => {
                event.preventDefault();
                createMutation.mutate({
                  providerName,
                  providerType,
                  status,
                  credentialReference,
                });
              }}
            >
              <Input
                value={providerName}
                onChange={(event) => setProviderName(event.target.value)}
                placeholder={t('sources.providerName')}
                required
              />
              <Select value={providerType} onChange={(event) => setProviderType(event.target.value as (typeof providerTypes)[number])}>
                {providerTypes.map((value) => (
                  <option key={value} value={value}>
                    {t(`providers.${value}`)}
                  </option>
                ))}
              </Select>
              <Select value={status} onChange={(event) => setStatus(event.target.value as (typeof statusTypes)[number])}>
                {statusTypes.map((value) => (
                  <option key={value} value={value}>
                    {t(`sources.status.${value}`)}
                  </option>
                ))}
              </Select>
              <Input
                value={credentialReference}
                onChange={(event) => setCredentialReference(event.target.value)}
                placeholder={t('sources.credentialReference')}
                required
              />
              <Button className="w-full" type="submit" disabled={createMutation.isPending}>
                {t('sources.create')}
              </Button>
            </form>
            {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
          </Card>
        </div>

        <Card className="space-y-4">
          <h2 className="text-lg font-semibold">{t('sources.title')}</h2>
          <div className="space-y-4">
            {sourcesQuery.data.financialSources.length > 0 ? (
              sourcesQuery.data.financialSources.map((source) => (
                <div key={source.id} className="rounded-3xl border border-border p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-lg font-semibold">{source.providerName}</p>
                        <Badge>{t(`sources.status.${source.status}`)}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{t(`providers.${source.providerType}`)}</p>
                      <p className="text-xs text-muted-foreground">{source.credentialReference}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm sm:min-w-72">
                      <div className="rounded-2xl bg-muted/40 p-3">
                        <p className="text-muted-foreground">{t('sources.accounts')}</p>
                        <p className="mt-1 font-semibold">{source.accountCount}</p>
                      </div>
                      <div className="rounded-2xl bg-muted/40 p-3">
                        <p className="text-muted-foreground">{t('sources.credits')}</p>
                        <p className="mt-1 font-semibold">{source.creditCount}</p>
                      </div>
                      <div className="rounded-2xl bg-muted/40 p-3">
                        <p className="text-muted-foreground">{t('sources.liquidBalance')}</p>
                        <p className="mt-1 font-semibold">{formatCurrency(source.liquidBalance, locale)}</p>
                      </div>
                      <div className="rounded-2xl bg-muted/40 p-3">
                        <p className="text-muted-foreground">{t('sources.outstandingBalance')}</p>
                        <p className="mt-1 font-semibold">{formatCurrency(source.outstandingCreditBalance, locale)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <p className="text-sm font-medium">{t('sources.quickActions')}</p>
                    <div className="flex flex-wrap gap-2">
                      {statusTypes.map((nextStatus) => (
                        <Button
                          key={nextStatus}
                          variant={source.status === nextStatus ? 'primary' : 'outline'}
                          className="h-9"
                          type="button"
                          onClick={() =>
                            updateMutation.mutate({
                              id: source.id,
                              nextStatus,
                            })
                          }
                        >
                          {t(`sources.status.${nextStatus}`)}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">{t('sources.empty')}</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

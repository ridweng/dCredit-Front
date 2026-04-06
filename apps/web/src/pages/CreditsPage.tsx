import { useQuery } from '@tanstack/react-query';
import { CreditCard } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CreditTimeline } from '@/components/CreditTimeline';
import { ErrorState } from '@/components/ErrorState';
import { LoadingState } from '@/components/LoadingState';
import { PageHeader } from '@/components/PageHeader';
import { StatCard } from '@/components/StatCard';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/context/LanguageContext';
import { formatCurrency, formatDate } from '@/lib/utils';
import { getCreditDetails, getCredits, getCreditsTimeline } from '@/services/api/credits';

export function CreditsPage() {
  const { creditId } = useParams();
  const navigate = useNavigate();
  const { locale, t } = useLanguage();

  const creditsQuery = useQuery({
    queryKey: ['credits'],
    queryFn: getCredits,
  });

  const timelineQuery = useQuery({
    queryKey: ['credits', 'timeline'],
    queryFn: getCreditsTimeline,
  });

  const selectedCreditId = creditId ?? creditsQuery.data?.credits[0]?.id;

  useEffect(() => {
    if (!creditId && creditsQuery.data?.credits[0]?.id) {
      navigate(`/credits/${creditsQuery.data.credits[0].id}`, { replace: true });
    }
  }, [creditId, creditsQuery.data?.credits, navigate]);

  const detailQuery = useQuery({
    queryKey: ['credits', selectedCreditId],
    queryFn: () => getCreditDetails(selectedCreditId!),
    enabled: Boolean(selectedCreditId),
  });

  if (creditsQuery.isLoading || timelineQuery.isLoading) {
    return <LoadingState />;
  }

  if (creditsQuery.isError || timelineQuery.isError || !creditsQuery.data || !timelineQuery.data) {
    return <ErrorState onRetry={() => { void creditsQuery.refetch(); void timelineQuery.refetch(); }} />;
  }

  const { summary, credits } = creditsQuery.data;

  return (
    <div className="space-y-6">
      <PageHeader title={t('credits.title')} subtitle={t('credits.subtitle')} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label={t('credits.totalCredits')} value={String(summary.totalCredits)} />
        <StatCard label={t('credits.totalOutstanding')} value={formatCurrency(summary.totalOutstandingBalance, locale)} />
        <StatCard label={t('credits.totalMonthly')} value={formatCurrency(summary.totalMonthlyPayment, locale)} />
        <StatCard
          label={t('credits.highInterest')}
          value={String(summary.highInterestCount)}
          detail={summary.nextUpcomingPayment?.effectiveDate ? formatDate(summary.nextUpcomingPayment.effectiveDate, locale) : t('common.none')}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="space-y-4">
          <h2 className="text-lg font-semibold">{t('credits.summaryTitle')}</h2>
          <div className="space-y-3">
            {credits.map((credit) => (
              <button
                key={credit.id}
                type="button"
                onClick={() => navigate(`/credits/${credit.id}`)}
                className={`w-full rounded-2xl border p-4 text-left transition ${
                  selectedCreditId === credit.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{credit.name}</p>
                      {credit.highInterest ? <Badge tone="warning">{t('credits.highInterestBadge')}</Badge> : null}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{credit.financialSource.providerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(credit.monthlyPayment, locale)}</p>
                    <p className="text-sm text-muted-foreground">{credit.interestRate.toFixed(1)}%</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>

        <div className="space-y-4">
          <CreditTimeline
            timeline={timelineQuery.data}
            selectedCreditId={selectedCreditId}
            onSelect={(id) => navigate(`/credits/${id}`)}
          />

          <Card className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">{t('credits.detailTitle')}</h2>
                <p className="text-sm text-muted-foreground">{detailQuery.data?.credit.name ?? t('credits.selectPrompt')}</p>
              </div>
            </div>

            {detailQuery.isLoading ? (
              <LoadingState />
            ) : detailQuery.data ? (
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-muted/40 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{t('credits.interestRate')}</p>
                    <p className="mt-2 text-2xl font-semibold">{detailQuery.data.credit.interestRate.toFixed(1)}%</p>
                  </div>
                  <div className="rounded-2xl bg-muted/40 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{t('credits.monthlyPayment')}</p>
                    <p className="mt-2 text-2xl font-semibold">{formatCurrency(detailQuery.data.credit.monthlyPayment, locale)}</p>
                  </div>
                  <div className="rounded-2xl bg-muted/40 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{t('credits.nextPaymentDate')}</p>
                    <p className="mt-2 font-semibold">{formatDate(detailQuery.data.credit.effectiveNextPaymentDate, locale)}</p>
                  </div>
                  <div className="rounded-2xl bg-muted/40 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{t('credits.remainingInstallments')}</p>
                    <p className="mt-2 font-semibold">
                      {detailQuery.data.credit.remainingInstallments ?? t('common.none')}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">{t('credits.installments')}</h3>
                  <div className="space-y-2">
                    {detailQuery.data.credit.installments.map((installment) => (
                      <div key={installment.id} className="flex items-center justify-between rounded-2xl border border-border px-4 py-3 text-sm">
                        <div>
                          <p className="font-medium">
                            {t('labels.installment')} {installment.installmentNumber}
                          </p>
                          <p className="text-muted-foreground">{formatDate(installment.dueDate, locale)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(installment.amount, locale)}</p>
                          <p className="text-muted-foreground">{installment.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{t('credits.selectPrompt')}</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

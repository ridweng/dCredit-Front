import { useQuery } from '@tanstack/react-query';
import { AlertCircle, Lightbulb, PiggyBank, Wallet } from 'lucide-react';
import { ErrorState } from '@/components/ErrorState';
import { InfoCard } from '@/components/InfoCard';
import { LoadingState } from '@/components/LoadingState';
import { PageHeader } from '@/components/PageHeader';
import { StatCard } from '@/components/StatCard';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/context/LanguageContext';
import { formatCurrency, formatDate, numberDeltaLabel } from '@/lib/utils';
import { getDashboardSummary } from '@/services/api/dashboard';

export function HomePage() {
  const { locale, t } = useLanguage();
  const summaryQuery = useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: getDashboardSummary,
  });

  if (summaryQuery.isLoading) {
    return <LoadingState />;
  }

  if (summaryQuery.isError || !summaryQuery.data) {
    return <ErrorState message={summaryQuery.error instanceof Error ? summaryQuery.error.message : undefined} onRetry={() => summaryQuery.refetch()} />;
  }

  const summary = summaryQuery.data;
  const weeklyDelta = summary.weeklySpending.comparison.percentageChange;
  const nextUpcomingPayment = summary.creditObligations.nextUpcomingPayment;

  const recommendations = summary.creditObligations.highInterestCredits.length > 0
    ? [
        {
          title: t('home.recommendationInterestTitle'),
          body: t('home.recommendationInterestBody', {
            count: summary.creditObligations.highInterestCredits.length,
          }),
          icon: <AlertCircle className="h-4 w-4" />,
        },
      ]
    : [];

  if (weeklyDelta !== null) {
    recommendations.push({
      title: t('home.recommendationSpendingTitle'),
      body: t('home.recommendationSpendingBody', { change: Math.abs(weeklyDelta).toFixed(1) }),
      icon: <PiggyBank className="h-4 w-4" />,
    });
  }

  recommendations.push({
    title:
      summary.liquidBalance.totalLiquidBalance >= summary.creditObligations.totalMonthlyPayment * 2
        ? t('home.recommendationHealthyTitle')
        : t('home.recommendationLiquidityTitle'),
    body:
      summary.liquidBalance.totalLiquidBalance >= summary.creditObligations.totalMonthlyPayment * 2
        ? t('home.recommendationHealthyBody')
        : t('home.recommendationLiquidityBody'),
    icon: <Lightbulb className="h-4 w-4" />,
  });

  return (
    <div className="space-y-6">
      <PageHeader title={t('home.title')} subtitle={t('home.subtitle')} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label={t('home.balance')}
          value={formatCurrency(summary.liquidBalance.totalLiquidBalance, locale)}
          detail={`${summary.liquidBalance.accountCount} ${t('metrics.accounts')}`}
          highlight
        />
        <StatCard
          label={t('home.weeklySpending')}
          value={formatCurrency(summary.weeklySpending.currentWeek.total, locale)}
          delta={weeklyDelta}
          detail={weeklyDelta === null ? t('common.none') : numberDeltaLabel(weeklyDelta)}
        />
        <StatCard
          label={t('home.monthlyObligations')}
          value={formatCurrency(summary.creditObligations.totalMonthlyPayment, locale)}
          detail={summary.creditObligations.nextPaymentDate ? formatDate(summary.creditObligations.nextPaymentDate, locale) : t('common.none')}
        />
        <StatCard
          label={t('home.totalOutstanding')}
          value={formatCurrency(summary.overview.totalOutstandingBalance, locale)}
          detail={`${summary.overview.creditCount} ${t('metrics.credits')}`}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">{t('home.breakdown')}</h2>
              <p className="text-sm text-muted-foreground">
                {summary.liquidBalance.sourceCount} {t('metrics.sources')}
              </p>
            </div>
            <Badge>{t('home.balance')}</Badge>
          </div>
          <div className="space-y-4">
            {summary.liquidBalance.sources.map((source) => (
              <div key={source.financialSourceId} className="rounded-2xl border border-border bg-muted/30 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold">{source.providerName}</p>
                    <p className="text-sm text-muted-foreground">
                      {source.accounts.length} {t('metrics.accounts')} ·{' '}
                      {t(`sources.status.${source.status}`)}
                    </p>
                  </div>
                  <p className="text-lg font-semibold">
                    {formatCurrency(source.liquidBalance, locale)}
                  </p>
                </div>
                <div className="mt-3 space-y-2">
                  {source.accounts.map((account) => (
                    <div key={account.accountId} className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{account.accountName}</span>
                      <span>{formatCurrency(account.liquidBalance, locale, account.currency)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">{t('home.nextPayment')}</h2>
                <p className="text-sm text-muted-foreground">{nextUpcomingPayment?.name ?? t('common.none')}</p>
              </div>
            </div>
            {nextUpcomingPayment ? (
              <div className="space-y-2">
                <p className="text-3xl font-semibold">
                  {formatCurrency(nextUpcomingPayment.amount, locale)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(nextUpcomingPayment.effectiveDate, locale)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t('credits.interestRate')}: {nextUpcomingPayment.interestRate.toFixed(1)}%
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{t('home.empty')}</p>
            )}
          </Card>

          <Card className="space-y-4">
            <h2 className="text-lg font-semibold">{t('home.highInterest')}</h2>
            {summary.creditObligations.highInterestCredits.length > 0 ? (
              <div className="space-y-3">
                {summary.creditObligations.highInterestCredits.map((credit) => (
                  <div key={credit.id} className="flex items-center justify-between rounded-2xl bg-muted/40 px-4 py-3">
                    <div>
                      <p className="font-medium">{credit.name}</p>
                      <p className="text-sm text-muted-foreground">{credit.interestRate.toFixed(1)}%</p>
                    </div>
                    <p className="text-sm font-semibold">{formatCurrency(credit.monthlyPayment, locale)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{t('home.recommendationHealthyBody')}</p>
            )}
          </Card>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {recommendations.map((recommendation) => (
          <InfoCard
            key={recommendation.title}
            title={recommendation.title}
            body={recommendation.body}
            icon={recommendation.icon}
          />
        ))}
      </div>
    </div>
  );
}

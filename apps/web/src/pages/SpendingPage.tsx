import { useQuery } from '@tanstack/react-query';
import {
  loadCategorySummaryUseCase,
  loadRecentTransactionsUseCase,
  loadWeeklySpendingUseCase,
} from '@dcredit/client-core';
import { useMemo, useState } from 'react';
import { dashboardApi, transactionsApi } from '@/client/client-core';
import { ErrorState } from '@/components/ErrorState';
import { LoadingState } from '@/components/LoadingState';
import { PageHeader } from '@/components/PageHeader';
import { StatCard } from '@/components/StatCard';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils';

export function SpendingPage() {
  const { token } = useAuth();
  const { locale, t } = useLanguage();
  const [categoryKey, setCategoryKey] = useState('');

  const weeklyQuery = useQuery({
    queryKey: ['dashboard', 'weekly-spending'],
    queryFn: () => loadWeeklySpendingUseCase(dashboardApi, token!),
    enabled: Boolean(token),
  });

  const categoriesQuery = useQuery({
    queryKey: ['transactions', 'categories-summary'],
    queryFn: () => loadCategorySummaryUseCase(transactionsApi, token!),
    enabled: Boolean(token),
  });

  const recentTransactionsQuery = useQuery({
    queryKey: ['transactions', 'recent', categoryKey],
    queryFn: () =>
      loadRecentTransactionsUseCase(transactionsApi, token!, {
        limit: 8,
        categoryKey: categoryKey || undefined,
      }),
    enabled: Boolean(token),
  });

  const maxDay = useMemo(() => {
    return Math.max(...(weeklyQuery.data?.currentWeek.groupedByDay.map((item) => item.total) ?? [1]));
  }, [weeklyQuery.data?.currentWeek.groupedByDay]);

  if (weeklyQuery.isLoading || categoriesQuery.isLoading || recentTransactionsQuery.isLoading) {
    return <LoadingState />;
  }

  if (
    weeklyQuery.isError ||
    categoriesQuery.isError ||
    recentTransactionsQuery.isError ||
    !weeklyQuery.data ||
    !categoriesQuery.data ||
    !recentTransactionsQuery.data
  ) {
    return <ErrorState onRetry={() => {
      void weeklyQuery.refetch();
      void categoriesQuery.refetch();
      void recentTransactionsQuery.refetch();
    }} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader title={t('spending.title')} subtitle={t('spending.subtitle')} />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label={t('spending.currentWeek')} value={formatCurrency(weeklyQuery.data.currentWeek.total, locale)} />
        <StatCard label={t('spending.previousWeek')} value={formatCurrency(weeklyQuery.data.previousWeek.total, locale)} />
        <StatCard
          label={t('spending.change')}
          value={
            weeklyQuery.data.comparison.percentageChange === null
              ? t('common.none')
              : `${weeklyQuery.data.comparison.percentageChange.toFixed(1)}%`
          }
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <Card className="space-y-4">
          <h2 className="text-lg font-semibold">{t('spending.byDay')}</h2>
          <div className="space-y-3">
            {weeklyQuery.data.currentWeek.groupedByDay.map((day) => (
              <div key={day.date} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{formatDate(day.date, locale)}</span>
                  <span className="font-medium">{formatCurrency(day.total, locale)}</span>
                </div>
                <div className="h-3 rounded-full bg-muted">
                  <div
                    className="h-3 rounded-full bg-primary"
                    style={{ width: `${(day.total / maxDay) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">{t('spending.byCategory')}</h2>
              <p className="text-sm text-muted-foreground">
                {formatCurrency(categoriesQuery.data.totalClassifiedSpending, locale)}
              </p>
            </div>
            <div className="w-full max-w-xs">
              <Select value={categoryKey} onChange={(event) => setCategoryKey(event.target.value)}>
                <option value="">{t('spending.filterAll')}</option>
                {categoriesQuery.data.categories.map((category) => (
                  <option key={category.categoryKey} value={category.categoryKey}>
                    {category.categoryName}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            {categoriesQuery.data.categories.map((category) => (
              <div key={category.categoryKey} className="space-y-2 rounded-2xl border border-border p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{category.categoryName}</p>
                  <p className="text-sm text-muted-foreground">{category.percentage.toFixed(1)}%</p>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-primary" style={{ width: `${category.percentage}%` }} />
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{category.transactionCount} {t('metrics.transactions')}</span>
                  <span>{formatCurrency(category.total, locale)}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="space-y-4">
        <h2 className="text-lg font-semibold">{t('spending.recentTransactions')}</h2>
        <div className="space-y-3">
          {recentTransactionsQuery.data.transactions.length > 0 ? (
            recentTransactionsQuery.data.transactions.map((transaction) => (
              <div key={transaction.id} className="flex flex-col gap-3 rounded-2xl border border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {transaction.category?.name ?? t('common.none')} · {transaction.account.accountName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {transaction.merchant ?? t('common.none')} · {formatDateTime(transaction.createdAt, locale)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(Math.abs(transaction.amount), locale, transaction.account.currency)}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(transaction.date, locale)}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">{t('spending.emptyTransactions')}</p>
          )}
        </div>
      </Card>
    </div>
  );
}

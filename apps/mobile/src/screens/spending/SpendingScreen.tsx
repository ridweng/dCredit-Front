import { useQuery } from '@tanstack/react-query';
import {
  loadCategorySummaryUseCase,
  loadRecentTransactionsUseCase,
  loadWeeklySpendingUseCase,
} from '@dcredit/client-core';
import { StyleSheet, Text, View } from 'react-native';
import { dashboardApi, transactionsApi } from '@/client/client-core';
import { AppScreen } from '@/components/AppScreen';
import { ErrorView } from '@/components/ErrorView';
import { LoadingView } from '@/components/LoadingView';
import { MetricCard } from '@/components/MetricCard';
import { SectionCard } from '@/components/SectionCard';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { formatCurrency, formatDate } from '@/lib/format';
import { colors } from '@/theme/colors';

export function SpendingScreen() {
  const { token } = useAuth();
  const { locale, t } = useLanguage();

  const weeklyQuery = useQuery({
    queryKey: ['mobile', 'weekly-spending'],
    queryFn: () => loadWeeklySpendingUseCase(dashboardApi, token!),
    enabled: Boolean(token),
  });

  const categoriesQuery = useQuery({
    queryKey: ['mobile', 'spending', 'categories'],
    queryFn: () => loadCategorySummaryUseCase(transactionsApi, token!),
    enabled: Boolean(token),
  });

  const transactionsQuery = useQuery({
    queryKey: ['mobile', 'spending', 'recent'],
    queryFn: () => loadRecentTransactionsUseCase(transactionsApi, token!),
    enabled: Boolean(token),
  });

  if (weeklyQuery.isLoading || categoriesQuery.isLoading || transactionsQuery.isLoading) {
    return <LoadingView />;
  }

  if (weeklyQuery.isError || categoriesQuery.isError || transactionsQuery.isError || !weeklyQuery.data || !categoriesQuery.data || !transactionsQuery.data) {
    return <ErrorView onRetry={() => {
      void weeklyQuery.refetch();
      void categoriesQuery.refetch();
      void transactionsQuery.refetch();
    }} />;
  }

  return (
    <AppScreen title={t('spending.title')} subtitle={t('spending.subtitle')}>
      <View style={styles.metricGrid}>
        <MetricCard label={t('spending.currentWeek')} value={formatCurrency(weeklyQuery.data.currentWeek.total, locale)} />
        <MetricCard label={t('spending.previousWeek')} value={formatCurrency(weeklyQuery.data.previousWeek.total, locale)} />
        <MetricCard
          label={t('spending.change')}
          value={
            weeklyQuery.data.comparison.percentageChange === null
              ? t('common.none')
              : `${weeklyQuery.data.comparison.percentageChange.toFixed(1)}%`
          }
        />
      </View>

      <SectionCard title={t('spending.byDay')}>
        {weeklyQuery.data.currentWeek.groupedByDay.map((day) => (
          <View key={day.date} style={styles.row}>
            <Text style={styles.rowTitle}>{formatDate(day.date, locale)}</Text>
            <Text style={styles.rowValue}>{formatCurrency(day.total, locale)}</Text>
          </View>
        ))}
      </SectionCard>

      <SectionCard title={t('spending.byCategory')}>
        {categoriesQuery.data.categories.map((category) => (
          <View key={category.categoryKey} style={styles.categoryCard}>
            <View style={styles.row}>
              <Text style={styles.rowTitle}>{category.categoryName}</Text>
              <Text style={styles.rowValue}>{category.percentage.toFixed(1)}%</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressValue, { width: `${category.percentage}%` }]} />
            </View>
            <Text style={styles.categoryMeta}>
              {formatCurrency(category.total, locale)} · {category.transactionCount} {t('metrics.transactions')}
            </Text>
          </View>
        ))}
      </SectionCard>

      <SectionCard title={t('spending.recentTransactions')}>
        {transactionsQuery.data.transactions.map((transaction) => (
          <View key={transaction.id} style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>{transaction.description}</Text>
              <Text style={styles.categoryMeta}>
                {transaction.category?.name ?? t('common.none')} · {transaction.account.accountName}
              </Text>
            </View>
            <Text style={styles.rowValue}>
              {formatCurrency(Math.abs(transaction.amount), locale, transaction.account.currency)}
            </Text>
          </View>
        ))}
      </SectionCard>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  rowTitle: {
    color: colors.text,
    fontWeight: '700',
  },
  rowValue: {
    color: colors.text,
    fontWeight: '700',
  },
  categoryCard: {
    gap: 8,
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.surfaceMuted,
  },
  progressValue: {
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.primary,
  },
  categoryMeta: {
    color: colors.textMuted,
    fontSize: 13,
  },
});

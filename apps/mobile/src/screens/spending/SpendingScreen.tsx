import { useQuery } from '@tanstack/react-query';
import {
  loadCategorySummaryUseCase,
  loadRecentTransactionsUseCase,
  loadWeeklySpendingUseCase,
} from '@/client-core';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { dashboardApi, transactionsApi } from '@/client/client-core';
import { AppScreen } from '@/components/AppScreen';
import { ErrorView } from '@/components/ErrorView';
import { LoadingView } from '@/components/LoadingView';
import { MetricCard } from '@/components/MetricCard';
import { SectionCard } from '@/components/SectionCard';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/format';
import { colors } from '@/theme/colors';

export function SpendingScreen() {
  const { token } = useAuth();
  const { locale, t } = useLanguage();
  const [categoryKey, setCategoryKey] = useState('');

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
    queryKey: ['mobile', 'spending', 'recent', categoryKey],
    queryFn: () =>
      loadRecentTransactionsUseCase(transactionsApi, token!, {
        limit: 8,
        categoryKey: categoryKey || undefined,
      }),
    enabled: Boolean(token),
  });

  const maxDay = useMemo(
    () => Math.max(...(weeklyQuery.data?.currentWeek.groupedByDay.map((item) => item.total) ?? [1])),
    [weeklyQuery.data?.currentWeek.groupedByDay],
  );

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
          <View key={day.date} style={styles.dayCard}>
            <View style={styles.row}>
              <Text style={styles.rowTitle}>{formatDate(day.date, locale)}</Text>
              <Text style={styles.rowValue}>{formatCurrency(day.total, locale)}</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressValue, { width: `${(day.total / maxDay) * 100}%` }]} />
            </View>
          </View>
        ))}
      </SectionCard>

      <SectionCard title={t('spending.byCategory')}>
        <Text style={styles.filterLabel}>{t('spending.filterLabel')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          <Pressable
            style={[styles.filterChip, categoryKey === '' ? styles.filterChipActive : null]}
            onPress={() => setCategoryKey('')}
          >
            <Text style={[styles.filterChipText, categoryKey === '' ? styles.filterChipTextActive : null]}>
              {t('spending.filterAll')}
            </Text>
          </Pressable>
          {categoriesQuery.data.categories.map((category) => (
            <Pressable
              key={category.categoryKey}
              style={[styles.filterChip, categoryKey === category.categoryKey ? styles.filterChipActive : null]}
              onPress={() => setCategoryKey(category.categoryKey)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  categoryKey === category.categoryKey ? styles.filterChipTextActive : null,
                ]}
              >
                {category.categoryName}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
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
        {transactionsQuery.data.transactions.length > 0 ? (
          transactionsQuery.data.transactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionCard}>
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowTitle}>{transaction.description}</Text>
                  <Text style={styles.categoryMeta}>
                    {transaction.category?.name ?? t('common.none')} · {transaction.account.accountName}
                  </Text>
                  <Text style={styles.categoryMeta}>
                    {transaction.merchant ?? t('common.none')} · {formatDateTime(transaction.createdAt, locale)}
                  </Text>
                </View>
                <Text style={styles.rowValue}>
                  {formatCurrency(Math.abs(transaction.amount), locale, transaction.account.currency)}
                </Text>
              </View>
              <Text style={styles.dateMeta}>{formatDate(transaction.date, locale)}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.categoryMeta}>{t('spending.emptyTransactions')}</Text>
        )}
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
  dayCard: {
    gap: 8,
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
  filterLabel: {
    color: colors.textMuted,
    fontSize: 13,
  },
  filterRow: {
    gap: 10,
    paddingBottom: 4,
  },
  filterChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: colors.surfaceMuted,
  },
  filterChipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  filterChipText: {
    color: colors.text,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: colors.primary,
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
  transactionCard: {
    gap: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
  },
  dateMeta: {
    color: colors.textMuted,
    fontSize: 12,
  },
});

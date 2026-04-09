import { useQuery } from '@tanstack/react-query';
import { loadDashboardSummaryUseCase } from '@dcredit/client-core';
import { Text, View, StyleSheet } from 'react-native';
import { dashboardApi } from '@/client/client-core';
import { AppScreen } from '@/components/AppScreen';
import { ErrorView } from '@/components/ErrorView';
import { LoadingView } from '@/components/LoadingView';
import { MetricCard } from '@/components/MetricCard';
import { SectionCard } from '@/components/SectionCard';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { formatCurrency, formatDate } from '@/lib/format';
import { colors } from '@/theme/colors';

export function HomeScreen() {
  const { token } = useAuth();
  const { locale, t } = useLanguage();

  const query = useQuery({
    queryKey: ['mobile', 'dashboard', 'summary'],
    queryFn: () => loadDashboardSummaryUseCase(dashboardApi, token!),
    enabled: Boolean(token),
  });

  if (query.isLoading) {
    return <LoadingView />;
  }

  if (query.isError || !query.data) {
    return <ErrorView onRetry={() => query.refetch()} />;
  }

  const summary = query.data;

  return (
    <AppScreen title={t('home.title')} subtitle={t('home.subtitle')}>
      <View style={styles.metricGrid}>
        <MetricCard
          label={t('home.balance')}
          value={formatCurrency(summary.liquidBalance.totalLiquidBalance, locale)}
          detail={`${summary.liquidBalance.accountCount} ${t('metrics.accounts')}`}
          highlight
        />
        <MetricCard
          label={t('home.weeklySpending')}
          value={formatCurrency(summary.weeklySpending.currentWeek.total, locale)}
          detail={
            summary.weeklySpending.comparison.percentageChange === null
              ? t('common.none')
              : `${summary.weeklySpending.comparison.percentageChange.toFixed(1)}%`
          }
        />
        <MetricCard
          label={t('home.monthlyObligations')}
          value={formatCurrency(summary.creditObligations.totalMonthlyPayment, locale)}
          detail={summary.creditObligations.nextPaymentDate ? formatDate(summary.creditObligations.nextPaymentDate, locale) : t('common.none')}
        />
        <MetricCard
          label={t('home.nextPayment')}
          value={
            summary.creditObligations.nextUpcomingPayment
              ? formatCurrency(summary.creditObligations.nextUpcomingPayment.amount, locale)
              : t('common.none')
          }
          detail={summary.creditObligations.nextUpcomingPayment?.name ?? t('common.none')}
        />
      </View>

      <SectionCard title={t('home.breakdown')}>
        {summary.liquidBalance.sources.map((source) => (
          <View key={source.financialSourceId} style={styles.row}>
            <View>
              <Text style={styles.rowTitle}>{source.providerName}</Text>
              <Text style={styles.rowSubtitle}>
                {source.accounts.length} {t('metrics.accounts')}
              </Text>
            </View>
            <Text style={styles.rowValue}>{formatCurrency(source.liquidBalance, locale)}</Text>
          </View>
        ))}
      </SectionCard>

      <SectionCard title={t('home.highInterest')}>
        {summary.creditObligations.highInterestCredits.length > 0 ? (
          summary.creditObligations.highInterestCredits.map((credit) => (
            <View key={credit.id} style={styles.row}>
              <View>
                <Text style={styles.rowTitle}>{credit.name}</Text>
                <Text style={styles.rowSubtitle}>{credit.interestRate.toFixed(1)}%</Text>
              </View>
              <Text style={styles.rowValue}>{formatCurrency(credit.monthlyPayment, locale)}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.note}>{t('home.recommendationHealthyBody')}</Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  rowTitle: {
    color: colors.text,
    fontWeight: '700',
  },
  rowSubtitle: {
    color: colors.textMuted,
    fontSize: 13,
  },
  rowValue: {
    color: colors.text,
    fontWeight: '700',
  },
  note: {
    color: colors.textMuted,
    lineHeight: 20,
  },
});

import { useQuery } from '@tanstack/react-query';
import { loadDashboardSummaryUseCase } from '@/client-core';
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

type RecommendationTone = 'warning' | 'primary' | 'success';

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
  const weeklyDelta = summary.weeklySpending.comparison.percentageChange;
  const nextUpcomingPayment = summary.creditObligations.nextUpcomingPayment;
  const recommendations: Array<{ title: string; body: string; tone: RecommendationTone }> =
    summary.creditObligations.highInterestCredits.length > 0
    ? [
        {
          title: t('home.recommendationInterestTitle'),
          body: t('home.recommendationInterestBody', {
            count: summary.creditObligations.highInterestCredits.length,
          }),
          tone: 'warning' as const,
        },
      ]
    : [];

  if (weeklyDelta !== null) {
    recommendations.push({
      title: t('home.recommendationSpendingTitle'),
      body: t('home.recommendationSpendingBody', { change: Math.abs(weeklyDelta).toFixed(1) }),
      tone: 'primary' as const,
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
    tone: 'success' as const,
  });

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
          <View key={source.financialSourceId} style={styles.sourceCard}>
            <View style={styles.row}>
              <View>
                <Text style={styles.rowTitle}>{source.providerName}</Text>
                <Text style={styles.rowSubtitle}>
                  {source.accounts.length} {t('metrics.accounts')}
                </Text>
              </View>
              <Text style={styles.rowValue}>{formatCurrency(source.liquidBalance, locale)}</Text>
            </View>
            {source.accounts.map((account) => (
              <View key={account.accountId} style={styles.accountRow}>
                <Text style={styles.rowSubtitle}>{account.accountName}</Text>
                <Text style={styles.accountValue}>
                  {formatCurrency(account.liquidBalance, locale, account.currency)}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </SectionCard>

      <SectionCard title={t('home.nextPayment')}>
        {nextUpcomingPayment ? (
          <View style={styles.paymentCard}>
            <Text style={styles.paymentTitle}>{nextUpcomingPayment.name}</Text>
            <Text style={styles.paymentAmount}>
              {formatCurrency(nextUpcomingPayment.amount, locale)}
            </Text>
            <Text style={styles.rowSubtitle}>
              {formatDate(nextUpcomingPayment.effectiveDate, locale)} · {nextUpcomingPayment.interestRate.toFixed(1)}%
            </Text>
            {nextUpcomingPayment.deferredPaymentDate ? (
              <Text style={styles.rowSubtitle}>
                {t('credits.deferredPaymentDate')}: {formatDate(nextUpcomingPayment.deferredPaymentDate, locale)}
              </Text>
            ) : null}
          </View>
        ) : (
          <Text style={styles.note}>{t('home.empty')}</Text>
        )}
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

      <SectionCard title={t('home.recommendations')}>
        {recommendations.map((recommendation) => (
          <View
            key={recommendation.title}
            style={[
              styles.recommendationCard,
              recommendation.tone === 'warning' ? styles.warningCard : null,
              recommendation.tone === 'success' ? styles.successCard : null,
            ]}
          >
            <Text style={styles.recommendationTitle}>{recommendation.title}</Text>
            <Text style={styles.recommendationBody}>{recommendation.body}</Text>
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
  sourceCard: {
    borderRadius: 18,
    backgroundColor: colors.surfaceMuted,
    padding: 14,
    gap: 8,
  },
  accountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  accountValue: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  paymentCard: {
    borderRadius: 18,
    backgroundColor: colors.primarySoft,
    padding: 16,
    gap: 6,
  },
  paymentTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
  },
  paymentAmount: {
    color: colors.primary,
    fontSize: 28,
    fontWeight: '800',
  },
  recommendationCard: {
    borderRadius: 18,
    backgroundColor: colors.primarySoft,
    padding: 16,
    gap: 6,
  },
  warningCard: {
    backgroundColor: colors.warningSoft,
  },
  successCard: {
    backgroundColor: colors.successSoft,
  },
  recommendationTitle: {
    color: colors.text,
    fontWeight: '700',
  },
  recommendationBody: {
    color: colors.textMuted,
    lineHeight: 19,
  },
  note: {
    color: colors.textMuted,
    lineHeight: 20,
  },
});

import { useQuery } from '@tanstack/react-query';
import { loadCreditsUseCase, loadCreditTimelineUseCase } from '@dcredit/client-core';
import { StyleSheet, Text, View } from 'react-native';
import { creditsApi } from '@/client/client-core';
import { AppScreen } from '@/components/AppScreen';
import { ErrorView } from '@/components/ErrorView';
import { LoadingView } from '@/components/LoadingView';
import { MetricCard } from '@/components/MetricCard';
import { SectionCard } from '@/components/SectionCard';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { formatCurrency, formatDate } from '@/lib/format';
import { colors } from '@/theme/colors';

export function CreditsScreen() {
  const { token } = useAuth();
  const { locale, t } = useLanguage();

  const creditsQuery = useQuery({
    queryKey: ['mobile', 'credits'],
    queryFn: () => loadCreditsUseCase(creditsApi, token!),
    enabled: Boolean(token),
  });

  const timelineQuery = useQuery({
    queryKey: ['mobile', 'credits', 'timeline'],
    queryFn: () => loadCreditTimelineUseCase(creditsApi, token!),
    enabled: Boolean(token),
  });

  if (creditsQuery.isLoading || timelineQuery.isLoading) {
    return <LoadingView />;
  }

  if (creditsQuery.isError || timelineQuery.isError || !creditsQuery.data || !timelineQuery.data) {
    return <ErrorView onRetry={() => {
      void creditsQuery.refetch();
      void timelineQuery.refetch();
    }} />;
  }

  return (
    <AppScreen title={t('credits.title')} subtitle={t('credits.subtitle')}>
      <View style={styles.metricGrid}>
        <MetricCard label={t('credits.totalCredits')} value={String(creditsQuery.data.summary.totalCredits)} />
        <MetricCard label={t('credits.totalOutstanding')} value={formatCurrency(creditsQuery.data.summary.totalOutstandingBalance, locale)} />
        <MetricCard label={t('credits.totalMonthly')} value={formatCurrency(creditsQuery.data.summary.totalMonthlyPayment, locale)} />
        <MetricCard label={t('credits.highInterest')} value={String(creditsQuery.data.summary.highInterestCount)} />
      </View>

      <SectionCard title={t('credits.summaryTitle')}>
        {creditsQuery.data.credits.map((credit) => (
          <View key={credit.id} style={styles.creditCard}>
            <View style={styles.creditHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.creditTitle}>{credit.name}</Text>
                <Text style={styles.creditMeta}>{credit.financialSource.providerName}</Text>
              </View>
              {credit.highInterest ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{t('credits.highInterestBadge')}</Text>
                </View>
              ) : null}
            </View>
            <View style={styles.creditStats}>
              <Text style={styles.creditStat}>{t('credits.interestRate')}: {credit.interestRate.toFixed(1)}%</Text>
              <Text style={styles.creditStat}>{t('credits.monthlyPayment')}: {formatCurrency(credit.monthlyPayment, locale)}</Text>
              <Text style={styles.creditStat}>
                {t('credits.nextPaymentDate')}: {formatDate(credit.deferredPaymentDate ?? credit.nextPaymentDate, locale)}
              </Text>
            </View>
          </View>
        ))}
      </SectionCard>

      <SectionCard title={t('credits.timeline')} subtitle={t('credits.timelineRange')}>
        {timelineQuery.data.credits.map((credit) => (
          <View key={credit.creditId} style={styles.timelineBlock}>
            <Text style={styles.creditTitle}>{credit.name}</Text>
            {credit.items.slice(0, 4).map((item) => (
              <View key={item.installmentId} style={styles.timelineRow}>
                <View style={styles.timelineDot} />
                <View style={styles.timelineContent}>
                  <Text style={styles.creditStat}>
                    {t('labels.installment')} {item.installmentNumber}
                  </Text>
                  <Text style={styles.creditMeta}>
                    {formatDate(item.dueDate, locale)} · {formatCurrency(item.amount, locale)}
                  </Text>
                </View>
              </View>
            ))}
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
  creditCard: {
    borderRadius: 20,
    backgroundColor: colors.surfaceMuted,
    padding: 14,
    gap: 10,
  },
  creditHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  creditTitle: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 16,
  },
  creditMeta: {
    color: colors.textMuted,
    fontSize: 13,
  },
  creditStats: {
    gap: 6,
  },
  creditStat: {
    color: colors.text,
    fontSize: 13,
  },
  badge: {
    backgroundColor: colors.warningSoft,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeText: {
    color: colors.warning,
    fontWeight: '700',
    fontSize: 12,
  },
  timelineBlock: {
    borderLeftWidth: 2,
    borderLeftColor: colors.primary,
    paddingLeft: 12,
    gap: 10,
  },
  timelineRow: {
    flexDirection: 'row',
    gap: 10,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: colors.primary,
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
    gap: 4,
  },
});

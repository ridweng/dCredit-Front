import { useQuery } from '@tanstack/react-query';
import {
  loadCreditDetailUseCase,
  loadCreditsUseCase,
  loadCreditTimelineUseCase,
} from '@/client-core';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
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
  const [selectedCreditId, setSelectedCreditId] = useState<string | null>(null);

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

  useEffect(() => {
    if (!selectedCreditId && creditsQuery.data?.credits[0]?.id) {
      setSelectedCreditId(creditsQuery.data.credits[0].id);
    }
  }, [creditsQuery.data?.credits, selectedCreditId]);

  const detailQuery = useQuery({
    queryKey: ['mobile', 'credits', 'detail', selectedCreditId],
    queryFn: () => loadCreditDetailUseCase(creditsApi, token!, selectedCreditId!),
    enabled: Boolean(token && selectedCreditId),
  });

  if (creditsQuery.isLoading || timelineQuery.isLoading || (selectedCreditId && detailQuery.isLoading)) {
    return <LoadingView />;
  }

  if (
    creditsQuery.isError ||
    timelineQuery.isError ||
    detailQuery.isError ||
    !creditsQuery.data ||
    !timelineQuery.data
  ) {
    return <ErrorView onRetry={() => {
      void creditsQuery.refetch();
      void timelineQuery.refetch();
      void detailQuery.refetch();
    }} />;
  }

  const selectedTimeline = useMemo(
    () => timelineQuery.data.credits.find((credit) => credit.creditId === selectedCreditId) ?? null,
    [selectedCreditId, timelineQuery.data.credits],
  );

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
          <Pressable
            key={credit.id}
            style={[
              styles.creditCard,
              selectedCreditId === credit.id ? styles.creditCardSelected : null,
            ]}
            onPress={() => setSelectedCreditId(credit.id)}
          >
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
          </Pressable>
        ))}
      </SectionCard>

      <SectionCard
        title={t('credits.detailTitle')}
        subtitle={detailQuery.data?.credit.name ?? t('credits.selectPrompt')}
      >
        {detailQuery.data ? (
          <>
            <View style={styles.detailGrid}>
              <View style={styles.detailStat}>
                <Text style={styles.detailLabel}>{t('credits.interestRate')}</Text>
                <Text style={styles.detailValue}>{detailQuery.data.credit.interestRate.toFixed(1)}%</Text>
              </View>
              <View style={styles.detailStat}>
                <Text style={styles.detailLabel}>{t('credits.monthlyPayment')}</Text>
                <Text style={styles.detailValue}>
                  {formatCurrency(detailQuery.data.credit.monthlyPayment, locale)}
                </Text>
              </View>
              <View style={styles.detailStat}>
                <Text style={styles.detailLabel}>{t('credits.nextPaymentDate')}</Text>
                <Text style={styles.detailSmallValue}>
                  {formatDate(detailQuery.data.credit.effectiveNextPaymentDate, locale)}
                </Text>
              </View>
              <View style={styles.detailStat}>
                <Text style={styles.detailLabel}>{t('credits.remainingInstallments')}</Text>
                <Text style={styles.detailSmallValue}>
                  {detailQuery.data.credit.remainingInstallments ?? t('common.none')}
                </Text>
              </View>
            </View>

            <Text style={styles.sectionLabel}>{t('credits.installments')}</Text>
            {detailQuery.data.credit.installments.map((installment) => (
              <View key={installment.id} style={styles.installmentRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowTitle}>
                    {t('labels.installment')} {installment.installmentNumber}
                  </Text>
                  <Text style={styles.rowSubtitle}>{formatDate(installment.dueDate, locale)}</Text>
                </View>
                <View style={styles.installmentMeta}>
                  <Text style={styles.rowValue}>{formatCurrency(installment.amount, locale)}</Text>
                  <Text style={styles.rowSubtitle}>{installment.status}</Text>
                </View>
              </View>
            ))}
          </>
        ) : (
          <Text style={styles.creditMeta}>{t('credits.selectPrompt')}</Text>
        )}
      </SectionCard>

      <SectionCard title={t('credits.timeline')} subtitle={t('credits.timelineRange')}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.timelineTabs}>
          {timelineQuery.data.credits.map((credit) => (
            <Pressable
              key={credit.creditId}
              style={[
                styles.timelineTab,
                selectedCreditId === credit.creditId ? styles.timelineTabSelected : null,
              ]}
              onPress={() => setSelectedCreditId(credit.creditId)}
            >
              <Text
                style={[
                  styles.timelineTabText,
                  selectedCreditId === credit.creditId ? styles.timelineTabTextSelected : null,
                ]}
              >
                {credit.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
        {selectedTimeline ? (
          <View style={styles.timelineBlock}>
            <Text style={styles.creditTitle}>{selectedTimeline.name}</Text>
            {selectedTimeline.items.map((item) => (
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
        ) : (
          <Text style={styles.creditMeta}>{t('credits.selectPrompt')}</Text>
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
  creditCard: {
    borderRadius: 20,
    backgroundColor: colors.surfaceMuted,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.surfaceMuted,
  },
  creditCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
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
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  detailStat: {
    minWidth: '47%',
    flexGrow: 1,
    borderRadius: 18,
    backgroundColor: colors.surfaceMuted,
    padding: 14,
    gap: 4,
  },
  detailLabel: {
    color: colors.textMuted,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  detailValue: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
  },
  detailSmallValue: {
    color: colors.text,
    fontWeight: '700',
  },
  sectionLabel: {
    color: colors.text,
    fontWeight: '700',
  },
  installmentRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
  },
  installmentMeta: {
    alignItems: 'flex-end',
    gap: 4,
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
  timelineTabs: {
    gap: 10,
    paddingBottom: 4,
  },
  timelineTab: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: colors.surfaceMuted,
  },
  timelineTabSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  timelineTabText: {
    color: colors.text,
    fontWeight: '600',
  },
  timelineTabTextSelected: {
    color: colors.primary,
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

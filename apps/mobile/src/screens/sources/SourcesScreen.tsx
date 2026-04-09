import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createFinancialSourceUseCase,
  loadFinancialSourcesUseCase,
} from '@dcredit/client-core';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { financialSourcesApi } from '@/client/client-core';
import { AppScreen } from '@/components/AppScreen';
import { ErrorView } from '@/components/ErrorView';
import { LoadingView } from '@/components/LoadingView';
import { PrimaryButton } from '@/components/PrimaryButton';
import { SectionCard } from '@/components/SectionCard';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { formatCurrency } from '@/lib/format';
import { colors } from '@/theme/colors';

export function SourcesScreen() {
  const { token } = useAuth();
  const { locale, t } = useLanguage();
  const queryClient = useQueryClient();
  const [providerName, setProviderName] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const sourcesQuery = useQuery({
    queryKey: ['mobile', 'sources'],
    queryFn: () => loadFinancialSourcesUseCase(financialSourcesApi, token!),
    enabled: Boolean(token),
  });

  const createMutation = useMutation({
    mutationFn: () =>
      createFinancialSourceUseCase(financialSourcesApi, token!, {
        providerName,
        providerType: 'manual',
        status: 'pending',
        credentialReference: `vault://sources/manual/${providerName || 'new-source'}`,
      }),
    onSuccess: () => {
      setProviderName('');
      setMessage(t('messages.sourceCreated'));
      void queryClient.invalidateQueries({ queryKey: ['mobile', 'sources'] });
    },
    onError: (mutationError: Error) => {
      setMessage(mutationError.message);
    },
  });

  if (sourcesQuery.isLoading) {
    return <LoadingView />;
  }

  if (sourcesQuery.isError || !sourcesQuery.data) {
    return <ErrorView onRetry={() => sourcesQuery.refetch()} />;
  }

  return (
    <AppScreen title={t('sources.title')} subtitle={t('sources.subtitle')}>
      <SectionCard title={t('sources.vaultTitle')} subtitle={t('sources.vaultBody')} />

      <SectionCard title={t('sources.addTitle')}>
        <TextInput
          style={styles.input}
          value={providerName}
          onChangeText={setProviderName}
          placeholder={t('sources.providerName')}
        />
        <PrimaryButton loading={createMutation.isPending} onPress={() => createMutation.mutate()}>
          {t('sources.create')}
        </PrimaryButton>
        {message ? <Text style={styles.note}>{message}</Text> : null}
      </SectionCard>

      <SectionCard title={t('sources.title')}>
        {sourcesQuery.data.financialSources.map((source) => (
          <View key={source.id} style={styles.sourceCard}>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.sourceTitle}>{source.providerName}</Text>
                <Text style={styles.sourceMeta}>{t(`providers.${source.providerType}`)}</Text>
              </View>
              <Text style={styles.status}>{t(`sources.status.${source.status}`)}</Text>
            </View>
            <Text style={styles.sourceMeta}>{source.credentialReference}</Text>
            <View style={styles.row}>
              <Text style={styles.sourceMeta}>
                {source.accountCount} {t('metrics.accounts')} · {source.creditCount} {t('metrics.credits')}
              </Text>
              <Text style={styles.sourceTitle}>{formatCurrency(source.liquidBalance, locale)}</Text>
            </View>
          </View>
        ))}
      </SectionCard>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: 14,
    color: colors.text,
  },
  note: {
    color: colors.textMuted,
  },
  sourceCard: {
    borderRadius: 20,
    backgroundColor: colors.surfaceMuted,
    padding: 14,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  sourceTitle: {
    color: colors.text,
    fontWeight: '700',
  },
  sourceMeta: {
    color: colors.textMuted,
    fontSize: 13,
  },
  status: {
    color: colors.primary,
    fontWeight: '700',
  },
});

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createFinancialSourceUseCase,
  loadFinancialSourcesUseCase,
  updateFinancialSourceUseCase,
} from '@/client-core';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
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

const statusTypes = ['active', 'pending', 'error', 'disconnected'] as const;

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

  const updateMutation = useMutation({
    mutationFn: ({ id, nextStatus }: { id: string; nextStatus: (typeof statusTypes)[number] }) =>
      updateFinancialSourceUseCase(financialSourcesApi, token!, id, { status: nextStatus }),
    onSuccess: () => {
      setMessage(t('messages.sourceUpdated'));
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
            <Text style={styles.quickActionsLabel}>{t('sources.quickActions')}</Text>
            <View style={styles.statusActions}>
              {statusTypes.map((nextStatus) => (
                <Pressable
                  key={nextStatus}
                  style={[
                    styles.statusChip,
                    source.status === nextStatus ? styles.statusChipActive : null,
                  ]}
                  onPress={() => updateMutation.mutate({ id: source.id, nextStatus })}
                >
                  <Text
                    style={[
                      styles.statusChipText,
                      source.status === nextStatus ? styles.statusChipTextActive : null,
                    ]}
                  >
                    {t(`sources.status.${nextStatus}`)}
                  </Text>
                </Pressable>
              ))}
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
  quickActionsLabel: {
    color: colors.text,
    fontWeight: '600',
    marginTop: 4,
  },
  statusActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  statusChipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  statusChipText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
  },
  statusChipTextActive: {
    color: colors.primary,
  },
});

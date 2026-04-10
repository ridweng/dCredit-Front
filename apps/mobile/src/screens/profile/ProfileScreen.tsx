import { useMutation } from '@tanstack/react-query';
import { updateCurrentUserLanguageUseCase } from '@/client-core';
import { StyleSheet, Text, View } from 'react-native';
import { usersApi } from '@/client/client-core';
import { AppScreen } from '@/components/AppScreen';
import { LanguageToggle } from '@/components/LanguageToggle';
import { PrimaryButton } from '@/components/PrimaryButton';
import { SectionCard } from '@/components/SectionCard';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { formatDateTime } from '@/lib/format';
import { colors } from '@/theme/colors';

export function ProfileScreen() {
  const { user, token, logout, updateUser } = useAuth();
  const { locale, setLocale, t } = useLanguage();

  const updateLanguageMutation = useMutation({
    mutationFn: (nextLocale: 'en' | 'es') =>
      updateCurrentUserLanguageUseCase(usersApi, token!, nextLocale),
    onSuccess: (response) => {
      updateUser(response);
      setLocale(response.preferredLanguage);
    },
  });

  if (!user) {
    return null;
  }

  return (
    <AppScreen title={t('profile.title')} subtitle={t('profile.subtitle')}>
      <SectionCard title={t('profile.details')}>
        <View style={styles.row}>
          <Text style={styles.label}>{t('common.fullName')}</Text>
          <Text style={styles.value}>{user.fullName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>{t('common.email')}</Text>
          <Text style={styles.value}>{user.email}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>{t('profile.verificationStatus')}</Text>
          <Text style={styles.value}>
            {user.emailVerified ? t('profile.verified') : t('profile.unverified')}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>{t('common.date')}</Text>
          <Text style={styles.value}>{formatDateTime(user.createdAt, locale)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>{t('profile.updated')}</Text>
          <Text style={styles.value}>{formatDateTime(user.updatedAt, locale)}</Text>
        </View>
      </SectionCard>

      <SectionCard title={t('profile.preferredLanguage')} subtitle={t('profile.tokenStored')}>
        <LanguageToggle />
        <View style={styles.actionRow}>
          <PrimaryButton variant="secondary" onPress={() => updateLanguageMutation.mutate(locale)}>
            {t('profile.saveLanguage')}
          </PrimaryButton>
          <PrimaryButton variant="ghost" onPress={() => void logout()}>
            {t('profile.logout')}
          </PrimaryButton>
        </View>
        {updateLanguageMutation.isSuccess ? (
          <Text style={styles.feedbackSuccess}>{t('messages.languageSaved')}</Text>
        ) : null}
        {updateLanguageMutation.isError ? (
          <Text style={styles.feedbackError}>
            {updateLanguageMutation.error instanceof Error
              ? updateLanguageMutation.error.message
              : t('messages.genericSaveError')}
          </Text>
        ) : null}
      </SectionCard>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  label: {
    color: colors.textMuted,
  },
  value: {
    color: colors.text,
    fontWeight: '700',
    flexShrink: 1,
    textAlign: 'right',
  },
  actionRow: {
    gap: 10,
  },
  feedbackSuccess: {
    color: colors.success,
    fontSize: 13,
  },
  feedbackError: {
    color: colors.danger,
    fontSize: 13,
  },
});

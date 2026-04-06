import { useMutation } from '@tanstack/react-query';
import { StyleSheet, Text, View } from 'react-native';
import { AppScreen } from '@/components/AppScreen';
import { LanguageToggle } from '@/components/LanguageToggle';
import { PrimaryButton } from '@/components/PrimaryButton';
import { SectionCard } from '@/components/SectionCard';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { updateCurrentUser } from '@/services/api/users';
import { colors } from '@/theme/colors';

export function ProfileScreen() {
  const { user, token, logout, updateUser } = useAuth();
  const { locale, setLocale, t } = useLanguage();

  const updateLanguageMutation = useMutation({
    mutationFn: (nextLocale: 'en' | 'es') => updateCurrentUser(token!, nextLocale),
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
      </SectionCard>

      <SectionCard title={t('profile.preferredLanguage')} subtitle={t('messages.languageSaved')}>
        <LanguageToggle />
        <View style={styles.actionRow}>
          <PrimaryButton variant="secondary" onPress={() => updateLanguageMutation.mutate(locale)}>
            {t('profile.saveLanguage')}
          </PrimaryButton>
          <PrimaryButton variant="ghost" onPress={() => void logout()}>
            {t('profile.logout')}
          </PrimaryButton>
        </View>
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
});

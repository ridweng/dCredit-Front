import { StyleSheet, Text, View } from 'react-native';
import { useLanguage } from '@/context/LanguageContext';
import { colors } from '@/theme/colors';
import { PrimaryButton } from './PrimaryButton';

export function ErrorView({
  message,
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  const { t } = useLanguage();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('common.error')}</Text>
      <Text style={styles.message}>{message ?? t('common.error')}</Text>
      {onRetry ? (
        <PrimaryButton variant="secondary" onPress={onRetry}>
          {t('common.retry')}
        </PrimaryButton>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 18,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  message: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
  },
});

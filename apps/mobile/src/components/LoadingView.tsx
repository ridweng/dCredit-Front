import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useLanguage } from '@/context/LanguageContext';
import { colors } from '@/theme/colors';

export function LoadingView() {
  const { t } = useLanguage();

  return (
    <View style={styles.container}>
      <ActivityIndicator color={colors.primary} />
      <Text style={styles.text}>{t('common.loading')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    alignItems: 'center',
    gap: 10,
  },
  text: {
    color: colors.textMuted,
  },
});

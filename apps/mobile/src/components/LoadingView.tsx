import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useLanguage } from '@/context/LanguageContext';
import { colors } from '@/theme/colors';

interface LoadingViewProps {
  label?: string;
  hint?: string;
  fullScreen?: boolean;
}

export function LoadingView({
  label,
  hint,
  fullScreen = false,
}: LoadingViewProps) {
  const { t } = useLanguage();

  return (
    <View style={[styles.container, fullScreen ? styles.fullScreen : null]}>
      <View style={styles.badge}>
        <ActivityIndicator color="#fff" size="small" />
      </View>
      <Text style={styles.text}>{label ?? t('common.loading')}</Text>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.background,
  },
  fullScreen: {
    flex: 1,
    paddingHorizontal: 24,
  },
  badge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  hint: {
    textAlign: 'center',
    color: colors.textMuted,
    lineHeight: 20,
    maxWidth: 280,
  },
});

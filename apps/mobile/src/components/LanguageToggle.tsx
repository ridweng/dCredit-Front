import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useLanguage } from '@/context/LanguageContext';
import { colors } from '@/theme/colors';

export function LanguageToggle() {
  const { locale, setLocale, t } = useLanguage();

  return (
    <View style={styles.container}>
      {(['en', 'es'] as const).map((value) => (
        <Pressable
          key={value}
          onPress={() => setLocale(value)}
          style={[styles.option, locale === value ? styles.active : null]}
        >
          <Text style={[styles.optionText, locale === value ? styles.activeText : null]}>
            {t(`languages.${value}`)}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  option: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  active: {
    backgroundColor: colors.primary,
  },
  optionText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  activeText: {
    color: '#fff',
  },
});

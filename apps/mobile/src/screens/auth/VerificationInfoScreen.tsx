import { Linking, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppScreen } from '@/components/AppScreen';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useLanguage } from '@/context/LanguageContext';
import { resendVerification } from '@/services/api/auth';
import { colors } from '@/theme/colors';
import type { AuthStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'VerificationInfo'>;

export function VerificationInfoScreen({ route, navigation }: Props) {
  const { t } = useLanguage();
  const email = route.params?.email;

  return (
    <AppScreen title={t('auth.verify.title')} subtitle={t('auth.register.successBody')}>
      <View style={styles.card}>
        <Text style={styles.title}>{t('auth.register.successTitle')}</Text>
        <Text style={styles.body}>{email ?? t('common.email')}</Text>
        <Text style={styles.help}>
          {t('messages.verificationResent')}
          {'\n\n'}
          Mobile note: the verification link currently opens the web route. Native deep linking can be added later once device routing is finalized.
        </Text>
      </View>

      <PrimaryButton variant="secondary" onPress={() => Linking.openURL('http://localhost:8025')}>
        {t('actions.openMailpit')}
      </PrimaryButton>

      <PrimaryButton
        variant="ghost"
        onPress={() => {
          if (email) {
            void resendVerification(email);
          }
        }}
      >
        {t('auth.verify.resendSubmit')}
      </PrimaryButton>

      <PrimaryButton variant="ghost" onPress={() => navigation.navigate('Login')}>
        {t('auth.verify.backToLogin')}
      </PrimaryButton>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.successSoft,
    borderRadius: 24,
    padding: 20,
    gap: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.success,
  },
  body: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  help: {
    color: colors.textMuted,
    lineHeight: 20,
  },
});

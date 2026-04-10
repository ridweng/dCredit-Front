import { useCallback, useEffect, useState } from 'react';
import {
  getVerificationStatusUseCase,
  loginWithSessionUseCase,
  resendVerificationUseCase,
} from '@/client-core';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { authApi, mobileSessionStoragePort } from '@/client/client-core';
import { AppScreen } from '@/components/AppScreen';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { colors } from '@/theme/colors';
import type { AuthStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'VerificationInfo'>;

const INITIAL_RETRY_SECONDS = 30;
const RETRY_STEP_SECONDS = 30;

export function VerificationInfoScreen({ route, navigation }: Props) {
  const { t } = useLanguage();
  const { login: persistLogin } = useAuth();
  const email = route.params?.email;
  const password = route.params?.password;
  const [retryInSeconds, setRetryInSeconds] = useState(INITIAL_RETRY_SECONDS);
  const [isChecking, setIsChecking] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>(t('auth.verify.autoSignIn'));

  const scheduleNextAttempt = useCallback(() => {
    setRetryInSeconds((current) => current + RETRY_STEP_SECONDS);
  }, []);

  const handleVerificationCheck = useCallback(async () => {
    if (!email || !password || isChecking) {
      navigation.replace('Login');
      return;
    }

    setIsChecking(true);

    try {
      const status = await getVerificationStatusUseCase(authApi, email);

      if (status.verified) {
        const session = await loginWithSessionUseCase(authApi, mobileSessionStoragePort, {
          email,
          password,
        });
        await persistLogin(session.token, session.user);
        return;
      }

      setStatusMessage(t('auth.verify.notVerifiedYet'));
      scheduleNextAttempt();
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : t('common.error'),
      );
      scheduleNextAttempt();
    } finally {
      setIsChecking(false);
    }
  }, [email, isChecking, navigation, password, persistLogin, scheduleNextAttempt, t]);

  useEffect(() => {
    if (isChecking) {
      return;
    }

    const timer = setInterval(() => {
      setRetryInSeconds((current) => {
        if (current <= 1) {
          void handleVerificationCheck();
          return current;
        }

        return current - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [handleVerificationCheck, isChecking]);

  return (
    <AppScreen title={t('auth.verify.title')} subtitle={t('auth.register.successBody')}>
      <View style={styles.heroCard}>
        <View style={styles.heroBadge}>
          {isChecking ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.heroBadgeText}>@</Text>
          )}
        </View>
        <Text style={styles.title}>{t('auth.register.successTitle')}</Text>
        <Text style={styles.body}>{email ?? t('common.email')}</Text>
        <Text style={styles.help}>{t('auth.verify.autoSignIn')}</Text>
      </View>

      <View style={styles.statusCard}>
        <Text style={styles.statusTitle}>{t('auth.verify.waitingTitle')}</Text>
        <Text style={styles.statusBody}>{statusMessage}</Text>
        <View style={styles.countdownRow}>
          <Text style={styles.countdownValue}>{retryInSeconds}s</Text>
          <Text style={styles.countdownLabel}>{t('auth.verify.autoRetryIn')}</Text>
        </View>
        <Text style={styles.statusHint}>{t('auth.verify.retryPattern')}</Text>
        <Text style={styles.statusHint}>{t('auth.verify.mobileInfo')}</Text>
      </View>

      <PrimaryButton onPress={() => void handleVerificationCheck()} loading={isChecking}>
        {t('auth.verify.iVerified')}
      </PrimaryButton>

      <PrimaryButton
        variant="ghost"
        onPress={() => {
          if (email) {
            void resendVerificationUseCase(authApi, email);
          }
        }}
      >
        {t('auth.verify.resendSubmit')}
      </PrimaryButton>

      <Pressable onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>{t('auth.verify.backToLogin')}</Text>
      </Pressable>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: colors.successSoft,
    borderRadius: 24,
    padding: 20,
    gap: 12,
    alignItems: 'flex-start',
  },
  heroBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.success,
  },
  heroBadgeText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
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
  statusCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
  },
  statusTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  statusBody: {
    color: colors.textMuted,
    lineHeight: 20,
  },
  countdownRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
    paddingTop: 4,
  },
  countdownValue: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primary,
  },
  countdownLabel: {
    color: colors.text,
    fontWeight: '600',
  },
  statusHint: {
    color: colors.textMuted,
    lineHeight: 18,
    fontSize: 13,
  },
  link: {
    textAlign: 'center',
    color: colors.textMuted,
    marginTop: 6,
    fontSize: 13,
  },
});

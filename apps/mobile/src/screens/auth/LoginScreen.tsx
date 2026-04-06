import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppScreen } from '@/components/AppScreen';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { login } from '@/services/api/auth';
import { colors } from '@/theme/colors';
import type { AuthStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const { login: persistLogin } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: () => login(email, password),
    onSuccess: async (response) => {
      await persistLogin(response.accessToken, response.user);
    },
    onError: (mutationError: Error) => {
      setError(mutationError.message);
    },
  });

  return (
    <AppScreen title={t('auth.login.title')} subtitle={t('auth.login.subtitle')}>
      <View style={styles.heroCard}>
        <Text style={styles.heroTitle}>{t('app.brand')}</Text>
        <Text style={styles.heroText}>{t('auth.login.demoHint')}</Text>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.label}>{t('common.email')}</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>{t('common.password')}</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <PrimaryButton loading={mutation.isPending} onPress={() => mutation.mutate()}>
          {t('auth.login.submit')}
        </PrimaryButton>

        <Pressable onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>
            {t('auth.login.noAccount')} <Text style={styles.linkStrong}>{t('auth.login.signUp')}</Text>
          </Text>
        </Pressable>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: colors.primary,
    borderRadius: 26,
    padding: 20,
    gap: 8,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  heroText: {
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 20,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  input: {
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: 14,
    color: colors.text,
  },
  link: {
    textAlign: 'center',
    color: colors.textMuted,
    marginTop: 4,
  },
  linkStrong: {
    color: colors.primary,
    fontWeight: '700',
  },
  error: {
    color: colors.danger,
  },
});

import { useMutation } from '@tanstack/react-query';
import { registerUseCase } from '@/client-core';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { authApi } from '@/client/client-core';
import { AppScreen } from '@/components/AppScreen';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useLanguage } from '@/context/LanguageContext';
import { colors } from '@/theme/colors';
import type { AuthStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props) {
  const { t } = useLanguage();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: () =>
      registerUseCase(authApi, {
        email,
        password,
        fullName,
        preferredLanguage: 'es',
      }),
    onSuccess: () => {
      navigation.replace('VerificationInfo', { email, password });
    },
    onError: (mutationError: Error) => {
      setError(mutationError.message);
    },
  });

  return (
    <AppScreen title={t('auth.register.title')} subtitle={t('auth.register.subtitle')}>
      <View style={styles.formCard}>
        <Text style={styles.label}>{t('common.fullName')}</Text>
        <TextInput style={styles.input} value={fullName} onChangeText={setFullName} />

        <Text style={styles.label}>{t('common.email')}</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
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
          {t('auth.register.submit')}
        </PrimaryButton>

        <Pressable onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>
            {t('auth.register.hasAccount')} <Text style={styles.linkStrong}>{t('auth.register.signIn')}</Text>
          </Text>
        </Pressable>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
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

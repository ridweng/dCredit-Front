import type { PropsWithChildren } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';
import { colors } from '@/theme/colors';

interface PrimaryButtonProps extends PropsWithChildren {
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
}

export function PrimaryButton({
  children,
  onPress,
  variant = 'primary',
  disabled,
  loading,
}: PrimaryButtonProps) {
  return (
    <Pressable
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variant === 'secondary' ? styles.secondaryButton : null,
        variant === 'ghost' ? styles.ghostButton : null,
        pressed ? styles.pressed : null,
        disabled || loading ? styles.disabled : null,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : colors.primary} />
      ) : (
        <Text
          style={[
            styles.buttonText,
            variant === 'secondary' ? styles.secondaryText : null,
            variant === 'ghost' ? styles.ghostText : null,
          ]}
        >
          {children}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  secondaryButton: {
    backgroundColor: colors.primarySoft,
  },
  ghostButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryText: {
    color: colors.primary,
  },
  ghostText: {
    color: colors.text,
  },
  disabled: {
    opacity: 0.6,
  },
  pressed: {
    opacity: 0.9,
  },
});

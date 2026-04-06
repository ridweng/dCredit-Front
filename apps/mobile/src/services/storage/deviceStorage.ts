import * as SecureStore from 'expo-secure-store';
import type { Locale } from '@dcredit/i18n';

const TOKEN_KEY = 'dcredit_mobile_token';
const LOCALE_KEY = 'dcredit_mobile_locale';

export async function getStoredToken() {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function setStoredToken(token: string) {
  return SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function clearStoredToken() {
  return SecureStore.deleteItemAsync(TOKEN_KEY);
}

export async function getStoredLocale() {
  return SecureStore.getItemAsync(LOCALE_KEY) as Promise<Locale | null>;
}

export async function setStoredLocale(locale: Locale) {
  return SecureStore.setItemAsync(LOCALE_KEY, locale);
}

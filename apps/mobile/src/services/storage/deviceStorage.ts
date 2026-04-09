import * as SecureStore from 'expo-secure-store';
import { FRONTEND_STORAGE_KEYS } from '@dcredit/core';
import type { Locale } from '@dcredit/i18n';

const TOKEN_KEY = FRONTEND_STORAGE_KEYS.mobileToken;
const LOCALE_KEY = FRONTEND_STORAGE_KEYS.mobileLocale;

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

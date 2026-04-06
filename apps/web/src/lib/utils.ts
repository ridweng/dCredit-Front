import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Locale } from '@dcredit/i18n';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  value: number,
  locale: Locale,
  currency = 'USD',
) {
  const intlLocale = locale === 'es' ? 'es-ES' : 'en-US';

  return new Intl.NumberFormat(intlLocale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

export function formatDate(value: string, locale: Locale) {
  const intlLocale = locale === 'es' ? 'es-ES' : 'en-US';

  return new Intl.DateTimeFormat(intlLocale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00Z`));
}

export function formatDateTime(value: string, locale: Locale) {
  const intlLocale = locale === 'es' ? 'es-ES' : 'en-US';

  return new Intl.DateTimeFormat(intlLocale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

export function numberDeltaLabel(value: number) {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
}

export function getDaysUntil(value: string) {
  const now = new Date();
  const target = new Date(`${value}T00:00:00Z`);
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

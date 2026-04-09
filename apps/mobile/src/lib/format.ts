import type { Locale } from '@dcredit/i18n';

export function formatCurrency(value: number, locale: Locale, currency = 'USD') {
  const intlLocale = locale === 'es' ? 'es-ES' : 'en-US';

  return new Intl.NumberFormat(intlLocale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDate(value: string, locale: Locale) {
  const intlLocale = locale === 'es' ? 'es-ES' : 'en-US';

  return new Intl.DateTimeFormat(intlLocale, {
    month: 'short',
    day: 'numeric',
  }).format(new Date(`${value}T00:00:00Z`));
}

export function formatDateTime(value: string, locale: Locale) {
  const intlLocale = locale === 'es' ? 'es-ES' : 'en-US';

  return new Intl.DateTimeFormat(intlLocale, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

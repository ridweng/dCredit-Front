// @dcredit/i18n — shared bilingual (EN/ES) string dictionaries
// No UI framework dependencies — safe for React, React Native, and Node.js.

export type Locale = 'en' | 'es';

export type TranslationDictionary = {
  nav: {
    home: string;
    debts: string;
    simulator: string;
    insights: string;
    data: string;
  };
  dashboard: {
    greeting: string;
    debtHealthScore: string;
    safeBorrowingCapacity: string;
    freeCashFlow: string;
    debtBurden: string;
    totalDebt: string;
  };
  simulator: {
    title: string;
    loanAmount: string;
    interestRate: string;
    termMonths: string;
    result: string;
    newPayment: string;
    riskStatus: {
      safe: string;
      caution: string;
      risky: string;
    };
  };
  common: {
    language: string;
    loading: string;
    error: string;
    save: string;
    cancel: string;
  };
};

const en: TranslationDictionary = {
  nav: {
    home: 'Home',
    debts: 'Debts',
    simulator: 'Simulator',
    insights: 'Insights',
    data: 'Data',
  },
  dashboard: {
    greeting: 'Good morning',
    debtHealthScore: 'Debt Health Score',
    safeBorrowingCapacity: 'Safe Borrowing Capacity',
    freeCashFlow: 'Free Cash Flow',
    debtBurden: 'Debt Burden',
    totalDebt: 'Total Debt',
  },
  simulator: {
    title: 'Loan Simulator',
    loanAmount: 'Loan Amount',
    interestRate: 'Interest Rate (%)',
    termMonths: 'Term (months)',
    result: 'Your Result',
    newPayment: 'New Monthly Payment',
    riskStatus: {
      safe: 'Safe',
      caution: 'Caution',
      risky: 'Risky',
    },
  },
  common: {
    language: 'Language',
    loading: 'Loading…',
    error: 'Something went wrong.',
    save: 'Save',
    cancel: 'Cancel',
  },
};

const es: TranslationDictionary = {
  nav: {
    home: 'Inicio',
    debts: 'Deudas',
    simulator: 'Simulador',
    insights: 'Análisis',
    data: 'Datos',
  },
  dashboard: {
    greeting: 'Buenos días',
    debtHealthScore: 'Salud de Deuda',
    safeBorrowingCapacity: 'Capacidad Segura',
    freeCashFlow: 'Flujo Libre',
    debtBurden: 'Carga de Deuda',
    totalDebt: 'Deuda Total',
  },
  simulator: {
    title: 'Simulador de Préstamo',
    loanAmount: 'Monto del Préstamo',
    interestRate: 'Tasa de Interés (%)',
    termMonths: 'Plazo (meses)',
    result: 'Tu Resultado',
    newPayment: 'Nuevo Pago Mensual',
    riskStatus: {
      safe: 'Seguro',
      caution: 'Precaución',
      risky: 'Riesgoso',
    },
  },
  common: {
    language: 'Idioma',
    loading: 'Cargando…',
    error: 'Algo salió mal.',
    save: 'Guardar',
    cancel: 'Cancelar',
  },
};

export const translations: Record<Locale, TranslationDictionary> = { en, es };

export function getTranslations(locale: Locale): TranslationDictionary {
  return translations[locale] ?? translations.en;
}

/** Resolve a dotted key path from the translation dictionary. */
export function t(locale: Locale, key: string): string {
  const dict = getTranslations(locale) as Record<string, unknown>;
  const parts = key.split('.');
  let current: unknown = dict;
  for (const part of parts) {
    if (typeof current !== 'object' || current === null) return key;
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === 'string' ? current : key;
}

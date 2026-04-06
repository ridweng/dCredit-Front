import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { type Locale, translateWeb } from '@dcredit/i18n';

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, number | string>) => string;
}

const LANGUAGE_STORAGE_KEY = 'dcredit_locale';
const LanguageContext = createContext<LanguageContextValue | null>(null);

function resolveInitialLocale(): Locale {
  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);

  if (stored === 'en' || stored === 'es') {
    return stored;
  }

  return 'es';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(resolveInitialLocale);

  useEffect(() => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, locale);
  }, [locale]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale,
      setLocale: setLocaleState,
      t: (key, params) => translateWeb(locale, key, params),
    }),
    [locale],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useLanguage must be used inside LanguageProvider');
  }

  return context;
}

export { LANGUAGE_STORAGE_KEY };

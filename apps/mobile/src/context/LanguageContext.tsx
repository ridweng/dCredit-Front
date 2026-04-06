import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { type Locale, translateWeb } from '@dcredit/i18n';
import { getStoredLocale, setStoredLocale } from '@/services/storage/deviceStorage';

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, number | string>) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('es');

  useEffect(() => {
    void (async () => {
      const stored = await getStoredLocale();

      if (stored === 'en' || stored === 'es') {
        setLocaleState(stored);
      }
    })();
  }, []);

  const setLocale = (nextLocale: Locale) => {
    setLocaleState(nextLocale);
    void setStoredLocale(nextLocale);
  };

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale,
      setLocale,
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

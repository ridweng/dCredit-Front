import { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { translations } from './translations';

// Custom hook to access translations based on current language.
// This can be reused in React Native with a compatible context.
export function useTranslation() {
  const { language } = useContext(LanguageContext);
  const t = translations[language];
  return { t, language };
}

import { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { useTranslation } from '../i18n/useTranslation';

export function LanguageSwitcher() {
  const { toggleLanguage } = useContext(LanguageContext);
  const { t, language } = useTranslation();

  return (
    <button
      onClick={toggleLanguage}
      data-testid="btn-language-switcher"
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-background text-sm font-medium text-foreground hover:bg-muted transition-colors"
    >
      <span className="text-xs font-semibold text-primary">{t.lang.current}</span>
      <span className="text-muted-foreground">·</span>
      <span className="text-muted-foreground">{t.lang.toggle}</span>
    </button>
  );
}

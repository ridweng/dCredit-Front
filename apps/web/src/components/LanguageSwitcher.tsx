import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLanguage();

  return (
    <div className="inline-flex items-center rounded-full border border-border bg-background p-1">
      {(['en', 'es'] as const).map((value) => (
        <Button
          key={value}
          variant="ghost"
          className={cn(
            'h-8 rounded-full px-3 text-xs',
            locale === value && 'bg-primary text-primary-foreground hover:bg-primary',
          )}
          onClick={() => setLocale(value)}
        >
          {t(`languages.${value}`)}
        </Button>
      ))}
    </div>
  );
}

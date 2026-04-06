import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export function LoadingState({ fullScreen = false }: { fullScreen?: boolean }) {
  const { t } = useLanguage();

  return (
    <div
      className={
        fullScreen
          ? 'flex min-h-screen items-center justify-center bg-background'
          : 'flex min-h-48 items-center justify-center'
      }
    >
      <div className="flex items-center gap-3 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>{t('common.loading')}</span>
      </div>
    </div>
  );
}

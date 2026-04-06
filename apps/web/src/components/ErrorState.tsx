import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/context/LanguageContext';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  const { t } = useLanguage();

  return (
    <Card className="space-y-4 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
        <AlertTriangle className="h-6 w-6 text-amber-700" />
      </div>
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">{t('common.error')}</h2>
        <p className="text-sm text-muted-foreground">{message ?? t('common.error')}</p>
      </div>
      {onRetry ? <Button onClick={onRetry}>{t('common.retry')}</Button> : null}
    </Card>
  );
}

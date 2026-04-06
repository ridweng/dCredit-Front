import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/context/LanguageContext';

export function NotFoundPage() {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg space-y-4 text-center">
        <h1 className="text-3xl font-semibold">{t('notFound.title')}</h1>
        <p className="text-sm text-muted-foreground">{t('notFound.body')}</p>
        <Link to="/">
          <Button>{t('notFound.goHome')}</Button>
        </Link>
      </Card>
    </div>
  );
}

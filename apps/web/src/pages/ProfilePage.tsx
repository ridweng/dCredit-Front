import { useMutation } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { PageHeader } from '@/components/PageHeader';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { formatDateTime } from '@/lib/utils';
import { updateCurrentUser } from '@/services/api/users';

export function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const { locale, setLocale, t } = useLanguage();

  const updateLanguageMutation = useMutation({
    mutationFn: updateCurrentUser,
    onSuccess: (response) => {
      updateUser(response);
      setLocale(response.preferredLanguage);
    },
  });

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <PageHeader title={t('profile.title')} subtitle={t('profile.subtitle')} />

      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="space-y-4">
          <h2 className="text-lg font-semibold">{t('profile.details')}</h2>
          <div className="space-y-3 text-sm">
            <div className="rounded-2xl bg-muted/40 p-4">
              <p className="text-muted-foreground">{t('common.fullName')}</p>
              <p className="mt-1 font-medium">{user.fullName}</p>
            </div>
            <div className="rounded-2xl bg-muted/40 p-4">
              <p className="text-muted-foreground">{t('common.email')}</p>
              <p className="mt-1 font-medium">{user.email}</p>
            </div>
            <div className="rounded-2xl bg-muted/40 p-4">
              <p className="text-muted-foreground">{t('profile.verificationStatus')}</p>
              <div className="mt-2">
                <Badge tone={user.emailVerified ? 'success' : 'warning'}>
                  {user.emailVerified ? t('profile.verified') : t('profile.unverified')}
                </Badge>
              </div>
            </div>
            <div className="rounded-2xl bg-muted/40 p-4">
              <p className="text-muted-foreground">{t('profile.session')}</p>
              <p className="mt-1 text-sm">{t('profile.tokenStored')}</p>
              <p className="mt-3 text-xs text-muted-foreground">
                {t('profile.updated')} {formatDateTime(user.updatedAt, locale)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="space-y-4">
          <h2 className="text-lg font-semibold">{t('profile.preferredLanguage')}</h2>
          <div className="space-y-3">
            <Select
              defaultValue={user.preferredLanguage}
              onChange={(event) => {
                const nextLocale = event.target.value as 'en' | 'es';
                setLocale(nextLocale);
                updateLanguageMutation.mutate({ preferredLanguage: nextLocale });
              }}
            >
              <option value="en">{t('languages.en')}</option>
              <option value="es">{t('languages.es')}</option>
            </Select>
            {updateLanguageMutation.isError ? (
              <p className="text-sm text-rose-700">
                {updateLanguageMutation.error instanceof Error
                  ? updateLanguageMutation.error.message
                  : t('messages.genericSaveError')}
              </p>
            ) : null}
            {updateLanguageMutation.isSuccess ? (
              <p className="text-sm text-emerald-700">{t('messages.languageSaved')}</p>
            ) : null}
            <Button variant="outline" onClick={logout}>
              {t('profile.logout')}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

import { APP_SECTIONS, type AppSectionId } from '@dcredit/core';
import {
  CreditCard,
  Landmark,
  LayoutDashboard,
  LogOut,
  PiggyBank,
  UserCircle2,
} from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

const navIcons: Record<AppSectionId, typeof LayoutDashboard> = {
  home: LayoutDashboard,
  credits: CreditCard,
  spending: PiggyBank,
  sources: Landmark,
  profile: UserCircle2,
};

export function AppShell() {
  const { logout, user } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-lg font-bold text-primary-foreground">
              d
            </div>
            <div>
              <p className="text-base font-semibold">{t('app.brand')}</p>
              <p className="text-xs text-muted-foreground">{t('app.tagline')}</p>
            </div>
          </div>

          <nav className="hidden items-center gap-2 md:flex">
            {APP_SECTIONS.map((item) => (
              <NavLink
                key={item.id}
                end={item.webPath === '/'}
                to={item.webPath}
                className={({ isActive }) =>
                  cn(
                    'rounded-full px-4 py-2 text-sm font-medium transition',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )
                }
              >
                {t(item.translationKey)}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <div className="rounded-full bg-muted px-3 py-2 text-sm text-muted-foreground">
              {user?.fullName}
            </div>
            <Button variant="outline" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              {t('auth.logout')}
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 pb-24 sm:px-6 md:py-8">
        <Outlet />
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 p-2 backdrop-blur md:hidden">
        <div className="grid grid-cols-5 gap-1">
          {APP_SECTIONS.map((item) => {
            const Icon = navIcons[item.id];

            return (
              <NavLink
                key={item.id}
                end={item.webPath === '/'}
                to={item.webPath}
                className={({ isActive }) =>
                  cn(
                    'flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-medium',
                    isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground',
                  )
                }
              >
                <Icon className="h-5 w-5" />
                <span>{t(item.translationKey)}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

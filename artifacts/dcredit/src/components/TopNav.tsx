import { Link, useLocation } from 'wouter';
import { useTranslation } from '../i18n/useTranslation';
import { LanguageSwitcher } from './LanguageSwitcher';
import { cn } from '../lib/utils';

const navItems = [
  { key: 'home' as const, path: '/dashboard' },
  { key: 'debts' as const, path: '/debts' },
  { key: 'simulator' as const, path: '/simulator' },
  { key: 'insights' as const, path: '/insights' },
  { key: 'data' as const, path: '/data' },
];

export function TopNav() {
  const { t } = useTranslation();
  const [location] = useLocation();

  return (
    <header className="hidden md:flex h-16 items-center border-b bg-card/80 backdrop-blur-sm px-6 sticky top-0 z-40">
      <div className="flex items-center gap-2 mr-8">
        <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-primary-foreground text-xs font-bold">d</span>
        </div>
        <span className="text-base font-bold text-foreground">{t.app.name}</span>
      </div>

      <nav className="flex items-center gap-1 flex-1">
        {navItems.map(({ key, path }) => {
          const isActive = location === path || (path === '/dashboard' && location === '/');
          return (
            <Link
              key={key}
              href={path}
              data-testid={`nav-link-${key}`}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted',
              )}
            >
              {t.nav[key]}
            </Link>
          );
        })}
      </nav>

      <LanguageSwitcher />
    </header>
  );
}

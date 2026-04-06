import { Link, useLocation } from 'wouter';
import { Home, CreditCard, Calculator, Lightbulb, Database } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';
import { cn } from '../lib/utils';

const navItems = [
  { key: 'home' as const, path: '/dashboard', Icon: Home },
  { key: 'debts' as const, path: '/debts', Icon: CreditCard },
  { key: 'simulator' as const, path: '/simulator', Icon: Calculator },
  { key: 'insights' as const, path: '/insights', Icon: Lightbulb },
  { key: 'data' as const, path: '/data', Icon: Database },
];

export function BottomNav() {
  const { t } = useTranslation();
  const [location] = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-card/95 backdrop-blur-sm border-t safe-bottom">
      <div className="flex items-stretch">
        {navItems.map(({ key, path, Icon }) => {
          const isActive = location === path || (path === '/dashboard' && location === '/');
          return (
            <Link
              key={key}
              href={path}
              data-testid={`nav-bottom-${key}`}
              className={cn(
                'flex-1 flex flex-col items-center justify-center py-2.5 gap-1 text-xs font-medium transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground',
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{t.nav[key]}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

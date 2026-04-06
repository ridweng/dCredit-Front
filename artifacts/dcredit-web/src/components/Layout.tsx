import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage, useT } from "@/contexts/LanguageContext";
import { 
  LayoutDashboard, 
  CreditCard, 
  PieChart, 
  Landmark, 
  User as UserIcon,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { logout } = useAuth();
  const { locale, setLocale } = useLanguage();
  const t = useT();

  const navigation = [
    { name: t('nav.home'), href: '/web/', icon: LayoutDashboard },
    { name: t('nav.credits'), href: '/web/credits', icon: CreditCard },
    { name: t('nav.spending'), href: '/web/spending', icon: PieChart },
    { name: t('nav.sources'), href: '/web/sources', icon: Landmark },
    { name: t('nav.profile'), href: '/web/profile', icon: UserIcon },
  ];

  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="font-bold text-xl text-primary tracking-tight">dCredit</div>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setLocale(locale === 'en' ? 'es' : 'en')}
            className="font-medium text-xs h-8 px-2"
          >
            {locale === 'en' ? 'ES' : 'EN'}
          </Button>
        </div>
      </header>

      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-sidebar px-4 py-6 sticky top-0 h-screen">
        <div className="font-bold text-2xl text-primary mb-8 px-2 tracking-tight">dCredit</div>
        
        <nav className="flex-1 space-y-1">
          {navigation.map((item) => {
            const isActive = location === item.href || (item.href !== '/web/' && location.startsWith(item.href));
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm font-medium ${
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                }`}
              >
                <item.icon className={`h-5 w-5 ${isActive ? "text-primary" : "text-sidebar-foreground/60"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="mt-auto pt-6 border-t border-sidebar-border space-y-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-sm font-medium text-sidebar-foreground/80">{t('profile.language')}</span>
            <div className="flex bg-sidebar-accent rounded-md p-1">
              <button 
                onClick={() => setLocale('en')}
                className={`px-2 py-1 text-xs font-medium rounded-sm transition-colors ${locale === 'en' ? 'bg-background shadow-sm' : 'text-sidebar-foreground/60 hover:text-sidebar-foreground'}`}
              >
                EN
              </button>
              <button 
                onClick={() => setLocale('es')}
                className={`px-2 py-1 text-xs font-medium rounded-sm transition-colors ${locale === 'es' ? 'bg-background shadow-sm' : 'text-sidebar-foreground/60 hover:text-sidebar-foreground'}`}
              >
                ES
              </button>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 px-3 text-sidebar-foreground/80 hover:text-destructive hover:bg-destructive/10"
            onClick={logout}
          >
            <LogOut className="h-5 w-5" />
            {t('profile.logout')}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 pb-20 md:pb-0">
        <div className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-card pb-safe z-50 flex justify-around p-2">
        {navigation.map((item) => {
          const isActive = location === item.href || (item.href !== '/web/' && location.startsWith(item.href));
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex flex-col items-center p-2 rounded-lg min-w-[64px] ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

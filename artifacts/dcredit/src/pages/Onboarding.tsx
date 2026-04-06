import { useLocation } from 'wouter';
import { CheckCircle2, ShieldCheck, BookOpen, ArrowRight } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { mockFinancialProfile } from '../data/mockData';

export default function Onboarding() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header with language switcher */}
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-sm font-bold">d</span>
          </div>
          <span className="text-lg font-bold text-foreground">{t.app.name}</span>
        </div>
        <LanguageSwitcher />
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-start px-6 py-8 max-w-2xl mx-auto w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-6">
            <ShieldCheck className="w-3.5 h-3.5" />
            {t.onboarding.trustMessage.split('.')[0]}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
            {t.onboarding.heroTitle}
          </h1>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed max-w-lg mx-auto">
            {t.onboarding.heroSubtitle}
          </p>
        </div>

        {/* Connected institutions */}
        <div className="w-full mb-8">
          <div className="rounded-2xl border bg-card shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <p className="text-sm font-semibold text-foreground">{t.onboarding.connectAccounts}</p>
            </div>
            <p className="text-xs text-muted-foreground mb-4">{t.onboarding.connectSubtitle}</p>
            <div className="flex flex-col gap-3">
              {mockFinancialProfile.institutions.map((inst) => (
                <div
                  key={inst.id}
                  data-testid={`institution-card-${inst.id}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                      <span className="text-primary text-xs font-bold">{inst.logo}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{inst.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {t.onboarding.lastSync}: {inst.lastSync}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-xs text-emerald-600 font-medium">{t.onboarding.connected}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trust points */}
        <div className="w-full mb-8">
          <div className="rounded-2xl border bg-muted/30 p-5">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">{t.onboarding.whyTrust}</p>
            </div>
            <ul className="flex flex-col gap-2.5">
              {t.onboarding.trustPoints.map((point, i) => (
                <li key={i} className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-sm text-foreground/80">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Demo note */}
        <p className="text-xs text-muted-foreground text-center mb-6">
          {t.onboarding.demoNote}
        </p>

        {/* CTA */}
        <button
          data-testid="btn-get-started"
          onClick={() => navigate('/dashboard')}
          className="w-full max-w-sm flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold py-4 rounded-2xl text-base hover:bg-primary/90 transition-colors shadow-sm"
        >
          {t.onboarding.getStarted}
          <ArrowRight className="w-4 h-4" />
        </button>
      </main>
    </div>
  );
}

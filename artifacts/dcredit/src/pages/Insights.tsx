import { useState, useContext } from 'react';
import { AlertTriangle, CheckSquare, Square } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';
import { FinancialContext } from '../contexts/FinancialContext';
import { AppShell } from '../components/AppShell';
import { SectionHeader } from '../components/SectionHeader';
import { DebtCard } from '../components/DebtCard';
import { TrendIndicator } from '../components/TrendIndicator';
import { RecommendationCard } from '../components/RecommendationCard';
import { EmptyState } from '../components/EmptyState';
import { generateRecommendations, detectTrend } from '../engine/recommendationEngine';
import { formatCurrency } from '../engine/financialCalculations';

export default function Insights() {
  const { t } = useTranslation();
  const { profile } = useContext(FinancialContext);
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());

  const trend = detectTrend(profile.monthlyHistory);
  const recommendations = generateRecommendations(profile);

  const toggleCheck = (i: number) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <AppShell>
      <SectionHeader
        title={t.insights.title}
        subtitle={t.insights.subtitle}
        className="mb-6"
      />

      {/* Priority debt */}
      {recommendations.priorityDebt && (
        <div className="mb-5">
          <SectionHeader title={t.insights.priorityDebt} className="mb-3" />
          <DebtCard debt={recommendations.priorityDebt} />
          <div className="mt-3 rounded-xl bg-muted/40 p-4">
            <p className="text-xs font-semibold text-foreground mb-1">{t.insights.whyPriority}</p>
            <p className="text-sm text-foreground/80 leading-relaxed">{recommendations.whyPriority}</p>
            <p className="mt-2 text-xs text-muted-foreground">{t.insights.explanationBase}</p>
          </div>
        </div>
      )}

      {/* Trend */}
      <div className="rounded-2xl border bg-card shadow-sm p-5 mb-5">
        <SectionHeader title={t.insights.trend} className="mb-4" />
        <div className="flex items-center gap-3 mb-3">
          <TrendIndicator trend={trend} />
        </div>
        <p className="text-sm text-foreground/70 leading-relaxed mb-4">
          {t.insights.trendDescription[trend]}
        </p>
        {/* Mini trend bars */}
        <div className="flex items-end gap-1.5 h-10">
          {profile.monthlyHistory.map((snap, i) => {
            const maxFcf = Math.max(...profile.monthlyHistory.map((s) => s.freeCashFlow));
            const height = maxFcf > 0 ? Math.max(10, (snap.freeCashFlow / maxFcf) * 100) : 10;
            const isLast = i === profile.monthlyHistory.length - 1;
            return (
              <div
                key={snap.month}
                data-testid={`insight-bar-${i}`}
                className={`flex-1 rounded-t-sm ${isLast ? 'bg-primary' : 'bg-primary/30'}`}
                style={{ height: `${height}%` }}
                title={`${snap.month}: ${formatCurrency(snap.freeCashFlow)}`}
              />
            );
          })}
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-muted-foreground">{profile.monthlyHistory[0]?.month}</span>
          <span className="text-xs text-muted-foreground font-medium">{profile.monthlyHistory[profile.monthlyHistory.length - 1]?.month}</span>
        </div>
      </div>

      {/* Alerts */}
      <div className="mb-5">
        <SectionHeader title={t.insights.alerts} className="mb-3" />
        {recommendations.alerts.length === 0 ? (
          <EmptyState title={t.insights.noAlerts} />
        ) : (
          <div className="flex flex-col gap-2.5">
            {recommendations.alerts.map((alert, i) => (
              <div
                key={i}
                data-testid={`alert-item-${i}`}
                className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4"
              >
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800 leading-relaxed">{alert}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action checklist */}
      <div>
        <SectionHeader title={t.insights.actionChecklist} className="mb-3" />
        <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
          {recommendations.actionChecklist.map((item, i) => {
            const checked = checkedItems.has(i);
            return (
              <button
                key={i}
                data-testid={`checklist-item-${i}`}
                onClick={() => toggleCheck(i)}
                className="w-full flex items-start gap-3 p-4 text-left hover:bg-muted/40 transition-colors border-b last:border-b-0 border-border/50"
              >
                {checked ? (
                  <CheckSquare className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                )}
                <span className={`text-sm leading-relaxed ${checked ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                  {item}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}

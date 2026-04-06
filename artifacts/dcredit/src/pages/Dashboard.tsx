import { useContext } from 'react';
import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';
import { FinancialContext } from '../contexts/FinancialContext';
import { AppShell } from '../components/AppShell';
import { SummaryStatCard } from '../components/SummaryStatCard';
import { RecommendationCard } from '../components/RecommendationCard';
import { DebtHealthMeter } from '../components/DebtHealthMeter';
import { TrendIndicator } from '../components/TrendIndicator';
import { SectionHeader } from '../components/SectionHeader';
import { calcDebtHealthScore } from '../engine/debtHealthScore';
import { calcSafeAdditionalMonthlyPayment, calcSafeBorrowingCapacity, formatCurrency, formatPercent } from '../engine/financialCalculations';
import { generateRecommendations, detectTrend } from '../engine/recommendationEngine';

export default function Dashboard() {
  const { t } = useTranslation();
  const { profile, currentSnapshot } = useContext(FinancialContext);

  const trend = detectTrend(profile.monthlyHistory);
  const { score, label } = calcDebtHealthScore(currentSnapshot, trend);
  const recommendations = generateRecommendations(profile);

  const safeAdditionalPayment = calcSafeAdditionalMonthlyPayment(
    currentSnapshot.freeCashFlow,
    currentSnapshot.income,
  );
  const safeBorrowingCapacity = calcSafeBorrowingCapacity(
    currentSnapshot.freeCashFlow,
    currentSnapshot.income,
    0.08 / 12,
    48,
  );

  const pressurePct = currentSnapshot.debtBurdenRatio;
  const pressureLabel =
    pressurePct < 0.3
      ? t.simulator.riskSafe
      : pressurePct < 0.4
      ? t.simulator.riskCaution
      : t.simulator.riskRisky;

  const prevSnapshot = profile.monthlyHistory[profile.monthlyHistory.length - 2];
  const fcfDelta = currentSnapshot.freeCashFlow - (prevSnapshot?.freeCashFlow ?? currentSnapshot.freeCashFlow);

  const recommendationBody = recommendations.priorityDebt
    ? `${t.insights.explanationBase} ${recommendations.whyPriority}`
    : t.insights.explanationBase;

  return (
    <AppShell>
      {/* Greeting */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">{t.dashboard.greeting}, {profile.user.name}</p>
        <h1 className="text-2xl font-bold text-foreground mt-0.5">{t.dashboard.title}</h1>
      </div>

      {/* Health score */}
      <div className="rounded-2xl border bg-card shadow-sm p-6 mb-4 flex flex-col items-center">
        <p className="text-sm font-medium text-muted-foreground mb-4">{t.dashboard.debtHealthScore}</p>
        <DebtHealthMeter score={score} label={label} />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <SummaryStatCard
          testId="stat-safe-borrowing"
          label={t.dashboard.safeBorrowing}
          value={formatCurrency(safeBorrowingCapacity)}
          subtext={t.dashboard.safeCapacityNote}
        />
        <SummaryStatCard
          testId="stat-free-cash-flow"
          label={t.dashboard.freeCashFlow}
          value={formatCurrency(currentSnapshot.freeCashFlow)}
          trend={fcfDelta >= 0 ? 'up' : 'down'}
          trendValue={`${formatCurrency(Math.abs(fcfDelta))}`}
          subtext={`${t.dashboard.lastMonth}: ${formatCurrency(prevSnapshot?.freeCashFlow ?? 0)}`}
        />
        <SummaryStatCard
          testId="stat-debt-burden"
          label={t.dashboard.cashFlowPressure}
          value={formatPercent(pressurePct)}
          subtext={pressureLabel}
        />
      </div>

      {/* Recommendation */}
      <div className="mb-4">
        <SectionHeader title={t.dashboard.primaryRecommendation} className="mb-3" />
        <RecommendationCard
          title={
            recommendations.priorityDebt
              ? `${t.insights.priorityDebt}: ${recommendations.priorityDebt.name}`
              : t.insights.priorityDebt
          }
          body={recommendationBody}
          footer={t.insights.explanationBase}
        />
      </div>

      {/* Trend */}
      <div className="rounded-2xl border bg-card shadow-sm p-5 mb-4">
        <SectionHeader title={t.dashboard.trendSummary} className="mb-4" />
        <div className="flex items-center gap-3 mb-4">
          <TrendIndicator trend={trend} />
        </div>
        <p className="text-sm text-foreground/70 leading-relaxed">
          {t.insights.trendDescription[trend]}
        </p>
        {/* Simple trend bars */}
        <div className="mt-4 flex items-end gap-1.5 h-12">
          {profile.monthlyHistory.map((snap, i) => {
            const maxFcf = Math.max(...profile.monthlyHistory.map((s) => s.freeCashFlow));
            const height = maxFcf > 0 ? Math.max(8, (snap.freeCashFlow / maxFcf) * 100) : 8;
            const isLast = i === profile.monthlyHistory.length - 1;
            return (
              <div
                key={snap.month}
                data-testid={`trend-bar-${i}`}
                title={`${snap.month}: ${formatCurrency(snap.freeCashFlow)}`}
                className={`flex-1 rounded-t-sm transition-all ${
                  isLast ? 'bg-primary' : 'bg-primary/30'
                }`}
                style={{ height: `${height}%` }}
              />
            );
          })}
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-muted-foreground">{profile.monthlyHistory[0]?.month}</span>
          <span className="text-xs text-muted-foreground font-medium">{t.dashboard.thisMonth}</span>
        </div>
      </div>

      {/* Quick links */}
      <div>
        <SectionHeader title={t.dashboard.quickLinks} className="mb-3" />
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: t.dashboard.viewDebts, path: '/debts' },
            { label: t.dashboard.trySimulator, path: '/simulator' },
            { label: t.dashboard.readInsights, path: '/insights' },
          ].map(({ label, path }) => (
            <Link
              key={path}
              href={path}
              data-testid={`quicklink-${path.replace('/', '')}`}
              className="flex items-center justify-between rounded-xl border bg-card px-3 py-3 text-xs font-medium text-foreground hover:bg-muted transition-colors"
            >
              <span>{label}</span>
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

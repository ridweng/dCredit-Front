import { useState, useContext, useMemo } from 'react';
import { useTranslation } from '../i18n/useTranslation';
import { FinancialContext } from '../contexts/FinancialContext';
import { AppShell } from '../components/AppShell';
import { SectionHeader } from '../components/SectionHeader';
import { StatusBadge } from '../components/StatusBadge';
import { formatCurrency, formatPercent, calcNewMonthlyPayment } from '../engine/financialCalculations';
import { simulateLoan } from '../engine/recommendationEngine';
import type { SimulatorInput } from '../types/financial';

const TERM_OPTIONS = [12, 24, 36, 48, 60];

export default function Simulator() {
  const { t } = useTranslation();
  const { profile, currentSnapshot } = useContext(FinancialContext);

  const [loanAmount, setLoanAmount] = useState(5000);
  const [interestRate, setInterestRate] = useState(8);
  const [termMonths, setTermMonths] = useState(36);

  const input: SimulatorInput = { loanAmount, interestRate, termMonths };
  const result = useMemo(() => {
    if (loanAmount <= 0) return null;
    return simulateLoan(profile, input);
  }, [loanAmount, interestRate, termMonths, profile]);

  const explanationText = result
    ? t.simulator.explanations[result.riskStatus]
    : t.simulator.placeholder;

  const totalCurrentDebt = currentSnapshot.debtPayments;
  const totalNewDebt = result ? totalCurrentDebt + result.newMonthlyPayment : totalCurrentDebt;
  const maxForBar = currentSnapshot.income;

  return (
    <AppShell>
      <SectionHeader
        title={t.simulator.title}
        subtitle={t.simulator.subtitle}
        className="mb-6"
      />

      {/* Form */}
      <div className="rounded-2xl border bg-card shadow-sm p-5 mb-4">
        {/* Loan amount */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-foreground mb-2">
            {t.simulator.loanAmount}
          </label>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl font-bold text-foreground">{formatCurrency(loanAmount)}</span>
          </div>
          <input
            data-testid="input-loan-amount-slider"
            type="range"
            min={500}
            max={50000}
            step={500}
            value={loanAmount}
            onChange={(e) => setLoanAmount(Number(e.target.value))}
            className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-muted-foreground">$500</span>
            <span className="text-xs text-muted-foreground">$50,000</span>
          </div>
          <input
            data-testid="input-loan-amount"
            type="number"
            min={0}
            max={100000}
            value={loanAmount}
            onChange={(e) => setLoanAmount(Math.max(0, Number(e.target.value)))}
            className="mt-3 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Enter amount"
          />
        </div>

        {/* Interest rate */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-foreground mb-2">
            {t.simulator.interestRate}
          </label>
          <input
            data-testid="input-interest-rate"
            type="number"
            min={0}
            max={50}
            step={0.1}
            value={interestRate}
            onChange={(e) => setInterestRate(Math.max(0, Number(e.target.value)))}
            className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Loan term */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {t.simulator.loanTerm}
          </label>
          <div className="flex gap-2 flex-wrap">
            {TERM_OPTIONS.map((term) => (
              <button
                key={term}
                data-testid={`btn-term-${term}`}
                onClick={() => setTermMonths(term)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                  termMonths === term
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-muted-foreground border-border hover:bg-muted'
                }`}
              >
                {term} {t.simulator.months}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="rounded-2xl border bg-card shadow-sm p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-foreground">{t.simulator.riskStatus}</p>
            <StatusBadge status={result.riskStatus} />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="rounded-xl bg-muted/40 p-3">
              <p className="text-xs text-muted-foreground">{t.simulator.estimatedPayment}</p>
              <p className="mt-1 text-lg font-bold text-foreground">
                {formatCurrency(result.newMonthlyPayment)}
                <span className="text-xs font-normal text-muted-foreground">{t.common.perMonth}</span>
              </p>
            </div>
            <div className="rounded-xl bg-muted/40 p-3">
              <p className="text-xs text-muted-foreground">{t.simulator.newFreeCashFlow}</p>
              <p className={`mt-1 text-lg font-bold ${result.newFreeCashFlow >= 0 ? 'text-foreground' : 'text-red-600'}`}>
                {formatCurrency(result.newFreeCashFlow)}
                <span className="text-xs font-normal text-muted-foreground">{t.common.perMonth}</span>
              </p>
            </div>
          </div>

          {/* Debt load bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground">{t.simulator.currentDebtLoad}</p>
              <p className="text-xs text-muted-foreground">{t.simulator.projectedDebtLoad}</p>
            </div>
            <div className="h-3 rounded-full bg-muted overflow-hidden">
              <div className="h-full flex">
                <div
                  className="bg-primary transition-all duration-500"
                  style={{ width: `${Math.min(100, (totalCurrentDebt / maxForBar) * 100)}%` }}
                />
                <div
                  className={`transition-all duration-500 ${result.riskStatus === 'safe' ? 'bg-emerald-400' : result.riskStatus === 'caution' ? 'bg-amber-400' : 'bg-red-400'}`}
                  style={{ width: `${Math.min(100 - (totalCurrentDebt / maxForBar) * 100, (result.newMonthlyPayment / maxForBar) * 100)}%` }}
                />
              </div>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-muted-foreground">
                {formatCurrency(totalCurrentDebt)}{t.common.perMonth}
              </span>
              <span className="text-xs font-medium text-foreground">
                +{formatCurrency(result.newMonthlyPayment)}{t.common.perMonth}
              </span>
            </div>
          </div>

          {/* Explanation */}
          <div className="rounded-xl bg-muted/40 p-4">
            <p className="text-xs font-semibold text-foreground mb-1.5">{t.simulator.explanation}</p>
            <p className="text-sm text-foreground/80 leading-relaxed">{explanationText}</p>
            {result.riskStatus !== 'safe' && (
              <div className="mt-3 pt-3 border-t border-border/50">
                <p className="text-xs font-semibold text-foreground mb-1">{t.simulator.betterNextStep}</p>
                <p className="text-sm text-foreground/70">
                  {t.simulator.nextSteps[result.riskStatus === 'caution' ? 'caution' : 'risky']}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {!result && (
        <div className="rounded-2xl border border-dashed bg-muted/20 p-8 text-center">
          <p className="text-sm text-muted-foreground">{t.simulator.placeholder}</p>
        </div>
      )}

      {/* Current context */}
      <div className="rounded-2xl border bg-muted/30 p-4">
        <p className="text-xs font-medium text-muted-foreground mb-2">{t.simulator.currentFcf}</p>
        <p className="text-lg font-bold text-foreground">{formatCurrency(currentSnapshot.freeCashFlow)}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {t.common.debtBurden}: {formatPercent(currentSnapshot.debtBurdenRatio)} {t.common.incomeOf}
        </p>
      </div>
    </AppShell>
  );
}

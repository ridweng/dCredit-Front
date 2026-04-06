import { useState, useContext } from 'react';
import { CheckCircle2, Info } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';
import { FinancialContext } from '../contexts/FinancialContext';
import { AppShell } from '../components/AppShell';
import { SectionHeader } from '../components/SectionHeader';
import { ConfidenceBadge } from '../components/ConfidenceBadge';
import { formatCurrency } from '../engine/financialCalculations';
import type { ConfidenceLevel } from '../types/financial';

export default function DataConfidence() {
  const { t } = useTranslation();
  const { profile, overrides, expenseCategories, setOverrides, resetOverrides, currentSnapshot } = useContext(FinancialContext);

  const [editIncome, setEditIncome] = useState(overrides.income);
  const [editExpenses, setEditExpenses] = useState(overrides.expenses);
  const [editing, setEditing] = useState(false);

  const handleApply = () => {
    setOverrides({ income: editIncome, expenses: editExpenses });
    setEditing(false);
  };

  const handleReset = () => {
    resetOverrides();
    setEditIncome(profile.user.monthlyIncome);
    setEditExpenses(profile.currentSnapshot.expenses);
    setEditing(false);
  };

  const confidenceLevels: Record<string, ConfidenceLevel> = {
    income: 'high',
    expenses: 'medium',
    debtPayments: 'high',
  };

  return (
    <AppShell>
      <SectionHeader
        title={t.data.title}
        subtitle={t.data.subtitle}
        className="mb-6"
      />

      {/* Connected institutions */}
      <div className="mb-6">
        <SectionHeader title={t.data.connectedInstitutions} className="mb-3" />
        <div className="flex flex-col gap-3">
          {profile.institutions.map((inst) => (
            <div
              key={inst.id}
              data-testid={`data-institution-${inst.id}`}
              className="flex items-center justify-between rounded-2xl border bg-card shadow-sm p-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <span className="text-primary text-xs font-bold">{inst.logo}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{inst.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.data.lastSync}: {inst.lastSync}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="text-xs text-emerald-600 font-medium">{t.onboarding.connected}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detected profile */}
      <div className="mb-6">
        <SectionHeader title={t.data.detectedProfile} className="mb-3" />
        <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
          {[
            { key: 'income', label: t.data.income, value: formatCurrency(currentSnapshot.income), confidence: confidenceLevels.income },
            { key: 'expenses', label: t.data.expenses, value: formatCurrency(currentSnapshot.expenses), confidence: confidenceLevels.expenses },
            { key: 'debtPayments', label: t.data.debtPayments, value: formatCurrency(currentSnapshot.debtPayments), confidence: confidenceLevels.debtPayments },
            { key: 'freeCashFlow', label: t.data.freeCashFlow, value: formatCurrency(currentSnapshot.freeCashFlow), confidence: 'high' as ConfidenceLevel },
          ].map(({ key, label, value, confidence }) => (
            <div
              key={key}
              data-testid={`data-row-${key}`}
              className="flex items-center justify-between p-4 border-b last:border-b-0 border-border/50"
            >
              <div>
                <p className="text-sm font-medium text-foreground">{label}</p>
                <p className="text-base font-bold text-foreground mt-0.5">{value}</p>
              </div>
              <ConfidenceBadge level={confidence} />
            </div>
          ))}
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Info className="w-3.5 h-3.5" />
          {t.data.confidenceNote}
        </p>
      </div>

      {/* Expense breakdown */}
      <div className="mb-6">
        <SectionHeader title={t.data.expenses} className="mb-3" />
        <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
          {Object.entries(expenseCategories).map(([key, amount]) => {
            const label = t.data.expenseCategories[key as keyof typeof t.data.expenseCategories] ?? key;
            return (
              <div
                key={key}
                data-testid={`expense-row-${key}`}
                className="flex items-center justify-between p-4 border-b last:border-b-0 border-border/50"
              >
                <p className="text-sm text-foreground">{label}</p>
                <p className="text-sm font-semibold text-foreground">{formatCurrency(amount)}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit assumptions */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <SectionHeader title={t.data.assumptions} />
          {!editing && (
            <button
              data-testid="btn-edit-assumptions"
              onClick={() => setEditing(true)}
              className="px-3 py-1.5 text-xs font-medium text-primary border border-primary/30 rounded-full hover:bg-primary/5 transition-colors"
            >
              {t.common.edit}
            </button>
          )}
        </div>
        <p className="text-xs text-muted-foreground mb-4">{t.data.assumptionsNote}</p>

        {editing ? (
          <div className="rounded-2xl border bg-card shadow-sm p-5 flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">{t.data.income}</label>
              <input
                data-testid="input-override-income"
                type="number"
                value={editIncome}
                onChange={(e) => setEditIncome(Number(e.target.value))}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">{t.data.expenses}</label>
              <input
                data-testid="input-override-expenses"
                type="number"
                value={editExpenses}
                onChange={(e) => setEditExpenses(Number(e.target.value))}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="flex gap-3">
              <button
                data-testid="btn-apply-assumptions"
                onClick={handleApply}
                className="flex-1 bg-primary text-primary-foreground font-medium py-2.5 rounded-xl text-sm hover:bg-primary/90 transition-colors"
              >
                {t.data.saveAssumptions}
              </button>
              <button
                data-testid="btn-reset-assumptions"
                onClick={handleReset}
                className="flex-1 border border-border text-foreground font-medium py-2.5 rounded-xl text-sm hover:bg-muted transition-colors"
              >
                {t.data.resetAssumptions}
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border bg-muted/30 p-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t.data.income}</span>
              <span className="font-semibold">{formatCurrency(overrides.income)}</span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-muted-foreground">{t.data.expenses}</span>
              <span className="font-semibold">{formatCurrency(overrides.expenses)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="rounded-2xl border border-dashed bg-muted/20 p-4">
        <p className="text-xs text-muted-foreground text-center leading-relaxed">
          {t.data.demoDisclaimer}
        </p>
      </div>
    </AppShell>
  );
}

import { useState, useContext, useMemo } from 'react';
import { useTranslation } from '../i18n/useTranslation';
import { FinancialContext } from '../contexts/FinancialContext';
import { AppShell } from '../components/AppShell';
import { DebtCard } from '../components/DebtCard';
import { SectionHeader } from '../components/SectionHeader';
import { formatCurrency, formatPercent } from '../engine/financialCalculations';
import type { DebtProduct } from '../types/financial';

type SortKey = 'priority' | 'apr' | 'balance';

const priorityOrder = { high: 0, medium: 1, low: 2 };

export default function Debts() {
  const { t } = useTranslation();
  const { profile } = useContext(FinancialContext);
  const [sortBy, setSortBy] = useState<SortKey>('priority');

  const totalDebt = profile.debts.reduce((sum, d) => sum + d.balance, 0);
  const totalMonthly = profile.debts.reduce((sum, d) => sum + d.monthlyPayment, 0);

  const sortedDebts = useMemo<DebtProduct[]>(() => {
    return [...profile.debts].sort((a, b) => {
      if (sortBy === 'priority') return priorityOrder[a.priority] - priorityOrder[b.priority];
      if (sortBy === 'apr') return b.apr - a.apr;
      return b.balance - a.balance;
    });
  }, [profile.debts, sortBy]);

  const sortOptions: { key: SortKey; label: string }[] = [
    { key: 'priority', label: t.debts.sortPriority },
    { key: 'apr', label: t.debts.sortApr },
    { key: 'balance', label: t.debts.sortBalance },
  ];

  return (
    <AppShell>
      <SectionHeader
        title={t.debts.title}
        subtitle={t.debts.subtitle}
        className="mb-6"
      />

      {/* Totals */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="rounded-2xl border bg-card shadow-sm p-4">
          <p className="text-xs text-muted-foreground">{t.debts.totalDebt}</p>
          <p className="mt-1 text-xl font-bold text-foreground" data-testid="total-debt">{formatCurrency(totalDebt)}</p>
        </div>
        <div className="rounded-2xl border bg-card shadow-sm p-4">
          <p className="text-xs text-muted-foreground">{t.debts.totalMonthlyPayments}</p>
          <p className="mt-1 text-xl font-bold text-foreground" data-testid="total-monthly">
            {formatCurrency(totalMonthly)}
            <span className="text-xs font-normal text-muted-foreground">{t.common.perMonth}</span>
          </p>
        </div>
      </div>

      {/* Sort controls */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm text-muted-foreground">{t.debts.sortBy}:</span>
        <div className="flex gap-1.5">
          {sortOptions.map(({ key, label }) => (
            <button
              key={key}
              data-testid={`btn-sort-${key}`}
              onClick={() => setSortBy(key)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
                sortBy === key
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background text-muted-foreground border-border hover:bg-muted'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Debt list */}
      <div className="flex flex-col gap-3">
        {sortedDebts.map((debt) => (
          <DebtCard key={debt.id} debt={debt} />
        ))}
      </div>
    </AppShell>
  );
}

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { DebtProduct } from '../types/financial';
import { useTranslation } from '../i18n/useTranslation';
import { formatCurrency, formatPercent } from '../engine/financialCalculations';
import { PriorityBadge } from './PriorityBadge';
import { cn } from '../lib/utils';

interface DebtCardProps {
  debt: DebtProduct;
}

export function DebtCard({ debt }: DebtCardProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const debtTypeLabel = t.debts.type[debt.type];

  return (
    <div
      data-testid={`debt-card-${debt.id}`}
      className="rounded-2xl border bg-card shadow-sm overflow-hidden transition-shadow hover:shadow-md"
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-semibold text-foreground">{debt.name}</h3>
              <span className="px-2 py-0.5 rounded-full bg-muted text-xs text-muted-foreground font-medium">
                {debtTypeLabel}
              </span>
            </div>
          </div>
          <PriorityBadge priority={debt.priority} />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">{t.debts.balance}</p>
            <p className="mt-0.5 text-lg font-bold text-foreground">{formatCurrency(debt.balance)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t.debts.monthlyPayment}</p>
            <p className="mt-0.5 text-lg font-bold text-foreground">
              {formatCurrency(debt.monthlyPayment)}
              <span className="text-xs font-normal text-muted-foreground">{t.common.perMonth}</span>
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t.debts.apr}</p>
            <p className="mt-0.5 text-lg font-bold text-foreground">{debt.apr}%</p>
          </div>
        </div>

        <button
          data-testid={`btn-debt-expand-${debt.id}`}
          onClick={() => setExpanded((p) => !p)}
          className="mt-4 flex items-center gap-1.5 text-xs text-primary font-medium hover:text-primary/80 transition-colors"
        >
          {t.debts.why}
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {expanded && (
        <div className="px-5 pb-5">
          <div className="rounded-xl bg-muted/50 p-4">
            <p className="text-sm text-foreground/80 leading-relaxed">{debt.priorityExplanation}</p>
          </div>
        </div>
      )}
    </div>
  );
}

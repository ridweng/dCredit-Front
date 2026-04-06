import type { RiskStatus } from '../types/financial';
import { useTranslation } from '../i18n/useTranslation';
import { cn } from '../lib/utils';

interface StatusBadgeProps {
  status: RiskStatus;
  className?: string;
}

const statusConfig = {
  safe: {
    bg: 'bg-emerald-50 border-emerald-200',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500',
  },
  caution: {
    bg: 'bg-amber-50 border-amber-200',
    text: 'text-amber-700',
    dot: 'bg-amber-500',
  },
  risky: {
    bg: 'bg-red-50 border-red-200',
    text: 'text-red-700',
    dot: 'bg-red-500',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const { t } = useTranslation();
  const config = statusConfig[status];
  const label =
    status === 'safe'
      ? t.simulator.riskSafe
      : status === 'caution'
      ? t.simulator.riskCaution
      : t.simulator.riskRisky;

  return (
    <span
      data-testid={`badge-status-${status}`}
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold',
        config.bg,
        config.text,
        className,
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', config.dot)} />
      {label}
    </span>
  );
}

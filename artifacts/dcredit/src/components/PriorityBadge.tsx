import type { PriorityLevel } from '../types/financial';
import { useTranslation } from '../i18n/useTranslation';
import { cn } from '../lib/utils';

interface PriorityBadgeProps {
  priority: PriorityLevel;
  className?: string;
}

const priorityConfig = {
  high: {
    bg: 'bg-red-50 border-red-200',
    text: 'text-red-700',
  },
  medium: {
    bg: 'bg-amber-50 border-amber-200',
    text: 'text-amber-700',
  },
  low: {
    bg: 'bg-emerald-50 border-emerald-200',
    text: 'text-emerald-700',
  },
};

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const { t } = useTranslation();
  const config = priorityConfig[priority];
  const label =
    priority === 'high'
      ? t.debts.priorityHigh
      : priority === 'medium'
      ? t.debts.priorityMedium
      : t.debts.priorityLow;

  return (
    <span
      data-testid={`badge-priority-${priority}`}
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full border text-xs font-semibold',
        config.bg,
        config.text,
        className,
      )}
    >
      {label}
    </span>
  );
}

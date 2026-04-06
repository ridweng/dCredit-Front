import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { TrendDirection } from '../types/financial';
import { useTranslation } from '../i18n/useTranslation';
import { cn } from '../lib/utils';

interface TrendIndicatorProps {
  trend: TrendDirection;
  showLabel?: boolean;
  className?: string;
}

export function TrendIndicator({ trend, showLabel = true, className }: TrendIndicatorProps) {
  const { t } = useTranslation();

  const config = {
    improving: {
      Icon: TrendingUp,
      color: 'text-emerald-600',
      label: t.insights.trendImproving,
    },
    stable: {
      Icon: Minus,
      color: 'text-slate-500',
      label: t.insights.trendStable,
    },
    tightening: {
      Icon: TrendingDown,
      color: 'text-amber-600',
      label: t.insights.trendTightening,
    },
  }[trend];

  return (
    <span
      data-testid={`trend-indicator-${trend}`}
      className={cn('inline-flex items-center gap-1', config.color, className)}
    >
      <config.Icon className="w-4 h-4" />
      {showLabel && <span className="text-sm font-medium">{config.label}</span>}
    </span>
  );
}

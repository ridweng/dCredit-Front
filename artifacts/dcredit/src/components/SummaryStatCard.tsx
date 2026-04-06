import { ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '../lib/utils';

interface SummaryStatCardProps {
  label: string;
  value: string;
  subtext?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  highlight?: boolean;
  className?: string;
  testId?: string;
}

export function SummaryStatCard({
  label,
  value,
  subtext,
  trend,
  trendValue,
  highlight,
  className,
  testId,
}: SummaryStatCardProps) {
  return (
    <div
      data-testid={testId ?? 'stat-card'}
      className={cn(
        'rounded-2xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md',
        highlight && 'border-primary/20 bg-primary/5',
        className,
      )}
    >
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
      {(subtext || trend) && (
        <div className="mt-2 flex items-center gap-2">
          {trend && trend !== 'neutral' && trendValue && (
            <span
              className={cn(
                'flex items-center gap-0.5 text-xs font-medium',
                trend === 'up' ? 'text-emerald-600' : 'text-red-600',
              )}
            >
              {trend === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
              {trendValue}
            </span>
          )}
          {subtext && <p className="text-xs text-muted-foreground">{subtext}</p>}
        </div>
      )}
    </div>
  );
}

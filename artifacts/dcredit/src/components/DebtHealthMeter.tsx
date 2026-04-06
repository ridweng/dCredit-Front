import type { HealthLabel } from '../engine/debtHealthScore';
import { useTranslation } from '../i18n/useTranslation';
import { cn } from '../lib/utils';

interface DebtHealthMeterProps {
  score: number;
  label: HealthLabel;
  className?: string;
}

const labelColors: Record<HealthLabel, string> = {
  excellent: 'text-emerald-600',
  good: 'text-teal-600',
  fair: 'text-amber-600',
  needs_attention: 'text-red-600',
};

const trackColors: Record<HealthLabel, string> = {
  excellent: 'bg-emerald-500',
  good: 'bg-teal-500',
  fair: 'bg-amber-500',
  needs_attention: 'bg-red-500',
};

export function DebtHealthMeter({ score, label, className }: DebtHealthMeterProps) {
  const { t } = useTranslation();

  const labelText: Record<HealthLabel, string> = {
    excellent: t.health.excellent,
    good: t.health.good,
    fair: t.health.fair,
    needs_attention: t.health.needs_attention,
  };

  return (
    <div data-testid="debt-health-meter" className={cn('flex flex-col items-center gap-3', className)}>
      {/* Score circle */}
      <div className="relative flex items-center justify-center">
        <svg width="120" height="120" viewBox="0 0 120 120" className="-rotate-90">
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-muted/40"
          />
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 50}`}
            strokeDashoffset={`${2 * Math.PI * 50 * (1 - score / 100)}`}
            className={cn(
              'transition-all duration-700',
              label === 'excellent' ? 'stroke-emerald-500' :
              label === 'good' ? 'stroke-teal-500' :
              label === 'fair' ? 'stroke-amber-500' :
              'stroke-red-500'
            )}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-foreground">{score}</span>
          <span className="text-xs text-muted-foreground">{t.health.score}</span>
        </div>
      </div>

      {/* Label */}
      <div className="text-center">
        <span className={cn('text-base font-semibold', labelColors[label])}>
          {labelText[label]}
        </span>
      </div>

      {/* Track bar */}
      <div className="w-full max-w-[200px]">
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className={cn('h-full rounded-full transition-all duration-700', trackColors[label])}
            style={{ width: `${score}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-muted-foreground">0</span>
          <span className="text-xs text-muted-foreground">100</span>
        </div>
      </div>
    </div>
  );
}

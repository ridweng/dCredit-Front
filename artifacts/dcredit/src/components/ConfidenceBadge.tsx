import type { ConfidenceLevel } from '../types/financial';
import { useTranslation } from '../i18n/useTranslation';
import { cn } from '../lib/utils';

interface ConfidenceBadgeProps {
  level: ConfidenceLevel;
  className?: string;
}

const confidenceConfig = {
  high: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700' },
  medium: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700' },
  needs_review: { bg: 'bg-red-50 border-red-200', text: 'text-red-700' },
};

export function ConfidenceBadge({ level, className }: ConfidenceBadgeProps) {
  const { t } = useTranslation();
  const config = confidenceConfig[level];
  const label = t.data.confidence[level];

  return (
    <span
      data-testid={`badge-confidence-${level}`}
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full border text-xs font-medium',
        config.bg,
        config.text,
        className,
      )}
    >
      {label}
    </span>
  );
}

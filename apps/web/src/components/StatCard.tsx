import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string;
  detail?: string;
  delta?: number | null;
  highlight?: boolean;
}

export function StatCard({ label, value, detail, delta, highlight }: StatCardProps) {
  return (
    <Card className={cn(highlight && 'border-primary/30 bg-primary/5')}>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold text-foreground">{value}</p>
      <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
        {delta !== null && delta !== undefined ? (
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold',
              delta > 0
                ? 'bg-rose-100 text-rose-700'
                : 'bg-emerald-100 text-emerald-700',
            )}
          >
            {delta > 0 ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {Math.abs(delta).toFixed(1)}%
          </span>
        ) : null}
        {detail ? <span>{detail}</span> : null}
      </div>
    </Card>
  );
}

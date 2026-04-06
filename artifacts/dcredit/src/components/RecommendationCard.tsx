import { Lightbulb } from 'lucide-react';
import { cn } from '../lib/utils';

interface RecommendationCardProps {
  title: string;
  body: string;
  footer?: string;
  className?: string;
}

export function RecommendationCard({ title, body, footer, className }: RecommendationCardProps) {
  return (
    <div
      data-testid="recommendation-card"
      className={cn(
        'rounded-2xl border border-primary/20 bg-primary/5 p-5 shadow-sm',
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
          <Lightbulb className="w-4 h-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-semibold text-primary">{title}</p>
          <p className="mt-1.5 text-sm text-foreground/80 leading-relaxed">{body}</p>
          {footer && (
            <p className="mt-3 text-xs text-muted-foreground italic">{footer}</p>
          )}
        </div>
      </div>
    </div>
  );
}

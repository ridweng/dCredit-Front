import { Inbox } from 'lucide-react';
import { cn } from '../lib/utils';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      data-testid="empty-state"
      className={cn('flex flex-col items-center justify-center py-16 px-6 text-center', className)}
    >
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
        {icon ?? <Inbox className="w-5 h-5 text-muted-foreground" />}
      </div>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      {description && <p className="mt-1 text-sm text-muted-foreground max-w-xs">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

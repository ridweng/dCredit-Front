import type { ReactNode } from 'react';
import { Card } from '@/components/ui/card';

interface InfoCardProps {
  title: string;
  body: string;
  icon?: ReactNode;
}

export function InfoCard({ title, body, icon }: InfoCardProps) {
  return (
    <Card className="border-primary/20 bg-primary/5">
      <div className="flex items-start gap-3">
        {icon ? (
          <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
            {icon}
          </div>
        ) : null}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-primary">{title}</h3>
          <p className="text-sm leading-6 text-foreground/80">{body}</p>
        </div>
      </div>
    </Card>
  );
}

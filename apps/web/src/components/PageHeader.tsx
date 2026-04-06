import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  actions?: ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{subtitle}</p>
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  );
}

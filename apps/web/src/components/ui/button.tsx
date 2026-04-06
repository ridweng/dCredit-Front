import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm',
  secondary:
    'bg-secondary text-secondary-foreground hover:bg-secondary/85',
  ghost:
    'bg-transparent text-foreground hover:bg-muted',
  danger:
    'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  outline:
    'border border-border bg-background text-foreground hover:bg-muted',
};

export function Button({
  className,
  variant = 'primary',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50',
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}

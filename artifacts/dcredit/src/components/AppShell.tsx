import type { ReactNode } from 'react';
import { TopNav } from './TopNav';
import { BottomNav } from './BottomNav';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopNav />
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-6 pb-24 md:pb-8">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}

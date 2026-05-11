// BorderLayoutView.tsx — JONA View (render puro, sin lógica)
import React from 'react';
import { cn } from '../../lib/cn';
import { InterBorderLayout } from './InterBorderLayout';

export const BorderLayoutView: React.FC<InterBorderLayout> = ({
  north, south, east, west, center,
  northClassName, southClassName, eastClassName, westClassName, centerClassName,
  className,
}) => (
  <div className={cn('flex min-h-screen w-full max-w-full min-w-0 flex-col overflow-hidden bg-neutral-50', className)}>
    {north && (
      <header className={northClassName}>
        {north}
      </header>
    )}
    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden md:flex-row">
      {west && (
        <aside className={westClassName}>
          {west}
        </aside>
      )}
  <main className={cn('flex min-w-0 flex-1 items-center justify-center overflow-auto p-4 sm:p-6', centerClassName)}>
        {center ?? <div className="text-neutral-300 text-sm">No content</div>}
      </main>
      {east && (
        <aside className={eastClassName}>
          {east}
        </aside>
      )}
    </div>
    {south && (
      <footer className={southClassName}>
        {south}
      </footer>
    )}
  </div>
);

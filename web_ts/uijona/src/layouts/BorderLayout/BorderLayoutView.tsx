// BorderLayoutView.tsx — JONA View (render puro, sin lógica)
import React from 'react';
import { cn } from '../../lib/cn';
import { InterBorderLayout } from './InterBorderLayout';

export const BorderLayoutView: React.FC<InterBorderLayout> = ({
  north, south, east, west, center,
  northClassName, southClassName, eastClassName, westClassName, centerClassName,
  className,
}) => (
  <div className={cn('flex flex-col min-h-screen bg-neutral-50', className)}>
    {north && (
      <header className={northClassName}>
        {north}
      </header>
    )}
    <div className="flex flex-1 overflow-hidden">
      {west && (
        <aside className={westClassName}>
          {west}
        </aside>
      )}
      <main className={centerClassName}>
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

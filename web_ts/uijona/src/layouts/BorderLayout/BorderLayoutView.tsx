// BorderLayoutView.tsx — JONA View (render puro, sin lógica)
import React from 'react';
import { cn } from '../../lib/cn';
import { InterBorderLayout } from './InterBorderLayout';
import { PanelAtom } from '../../atoms/PanelAtom/PanelAtom';

export const BorderLayoutView: React.FC<InterBorderLayout> = ({
  north, south, east, west, center,
  northClassName, southClassName, eastClassName, westClassName, centerClassName,
  className,
}) => (
  <PanelAtom variant="ghost" padding="none" radius="none" className={cn('flex min-h-screen w-full max-w-full min-w-0 flex-col overflow-hidden bg-neutral-50', className)}>
    {north && (
      <header className={northClassName}>
        {north}
      </header>
    )}
    <PanelAtom variant="ghost" padding="none" radius="none" className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden md:flex-row">
      {west && (
        <aside className={westClassName}>
          {west}
        </aside>
      )}
  <main className={cn('flex min-w-0 flex-1 items-center justify-center overflow-auto p-4 sm:p-6', centerClassName)}>
        {center ?? <PanelAtom variant="ghost" padding="none" radius="none" className="text-neutral-300 text-sm">No content</PanelAtom>}
      </main>
      {east && (
        <aside className={eastClassName}>
          {east}
        </aside>
      )}
    </PanelAtom>
    {south && (
      <footer className={southClassName}>
        {south}
      </footer>
    )}
  </PanelAtom>
);

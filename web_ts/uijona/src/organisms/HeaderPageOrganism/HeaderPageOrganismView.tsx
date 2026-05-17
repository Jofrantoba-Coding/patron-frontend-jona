// HeaderPageOrganismView.tsx — JONA View (render puro)
import React from 'react';
import { cn } from '../../lib/cn';
import { InterHeaderPageOrganism } from './InterHeaderPageOrganism';
import { JPanel } from '../../atoms/JPanel/JPanel';

export const HeaderPageOrganismView: React.FC<InterHeaderPageOrganism> = ({
  title,
  nav,
  actions,
  className,
}) => (
  <header
    className={cn(
      'flex min-w-0 flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6',
      'bg-white border-b border-neutral-200 shadow-sm',
      className
    )}
  >
    {/* Title / Logo */}
    <JPanel variant="ghost" padding="none" radius="none" className="min-w-0 flex-1 truncate text-lg font-semibold text-primary-600 md:flex-none">
      {title}
    </JPanel>

    {/* Navigation */}
    {nav && (
      <nav className="hidden min-w-0 max-w-full items-center gap-4 overflow-x-auto text-sm text-neutral-600 md:flex">
        {nav}
      </nav>
    )}

    {/* Actions */}
    {actions && (
      <JPanel variant="ghost" padding="none" radius="none" className="flex shrink-0 items-center gap-2">
        {actions}
      </JPanel>
    )}
  </header>
);

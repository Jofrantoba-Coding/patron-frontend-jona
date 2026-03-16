// HeaderPageOrganismView.tsx — JONA View (render puro)
import React from 'react';
import { cn } from '../../lib/cn';
import { InterHeaderPageOrganism } from './InterHeaderPageOrganism';

export const HeaderPageOrganismView: React.FC<InterHeaderPageOrganism> = ({
  title,
  nav,
  actions,
  className,
}) => (
  <header
    className={cn(
      'flex items-center justify-between px-6 py-3',
      'bg-white border-b border-neutral-200 shadow-sm',
      className
    )}
  >
    {/* Title / Logo */}
    <div className="flex items-center gap-3 font-semibold text-lg text-primary-600">
      {title}
    </div>

    {/* Navigation */}
    {nav && (
      <nav className="hidden md:flex items-center gap-4 text-sm text-neutral-600">
        {nav}
      </nav>
    )}

    {/* Actions */}
    {actions && (
      <div className="flex items-center gap-2">
        {actions}
      </div>
    )}
  </header>
);

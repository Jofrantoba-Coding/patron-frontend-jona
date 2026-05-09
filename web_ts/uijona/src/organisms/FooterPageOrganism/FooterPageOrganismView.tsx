// FooterPageOrganismView.tsx — JONA View (render puro)
import React from 'react';
import { cn } from '../../lib/cn';
import { InterFooterPageOrganism } from './InterFooterPageOrganism';

export const FooterPageOrganismView: React.FC<InterFooterPageOrganism> = ({
  text,
  left,
  center,
  right,
  className,
}) => (
  <footer
    className={cn(
      'flex min-w-0 flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6',
      'bg-white border-t border-neutral-200 text-sm text-neutral-500',
      className
    )}
  >
    {/* Left slot or fallback text */}
    <div className="min-w-0 flex-1 break-words md:flex-none">
      {left ?? <span>{text}</span>}
    </div>

    {/* Center slot */}
    {center && (
      <div className="hidden min-w-0 max-w-full items-center gap-4 overflow-x-auto md:flex">
        {center}
      </div>
    )}

    {/* Right slot */}
    {right && (
      <div className="flex shrink-0 items-center gap-2">
        {right}
      </div>
    )}
  </footer>
);

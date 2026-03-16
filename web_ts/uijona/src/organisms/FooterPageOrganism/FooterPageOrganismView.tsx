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
      'flex items-center justify-between px-6 py-3',
      'bg-white border-t border-neutral-200 text-sm text-neutral-500',
      className
    )}
  >
    {/* Left slot or fallback text */}
    <div className="flex items-center gap-2">
      {left ?? <span>{text}</span>}
    </div>

    {/* Center slot */}
    {center && (
      <div className="hidden md:flex items-center gap-4">
        {center}
      </div>
    )}

    {/* Right slot */}
    {right && (
      <div className="flex items-center gap-2">
        {right}
      </div>
    )}
  </footer>
);

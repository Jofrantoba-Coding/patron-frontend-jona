// FooterPageOrganismView.tsx — JONA View (render puro)
import React from 'react';
import { cn } from '../../lib/cn';
import { InterFooterPageOrganism } from './InterFooterPageOrganism';
import { PanelAtom } from '../../atoms/PanelAtom/PanelAtom';

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
    <PanelAtom variant="ghost" padding="none" radius="none" className="min-w-0 flex-1 break-words md:flex-none">
      {left ?? <span>{text}</span>}
    </PanelAtom>

    {/* Center slot */}
    {center && (
      <PanelAtom variant="ghost" padding="none" radius="none" className="hidden min-w-0 max-w-full items-center gap-4 overflow-x-auto md:flex">
        {center}
      </PanelAtom>
    )}

    {/* Right slot */}
    {right && (
      <PanelAtom variant="ghost" padding="none" radius="none" className="flex shrink-0 items-center gap-2">
        {right}
      </PanelAtom>
    )}
  </footer>
);

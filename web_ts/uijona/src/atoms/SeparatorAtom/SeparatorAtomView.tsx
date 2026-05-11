// SeparatorAtomView.tsx — JONA View (render puro)
import React from 'react';
import { cn } from '../../lib/cn';
import { InterSeparatorAtom } from './InterSeparatorAtom';
import { PanelAtom } from '../PanelAtom/PanelAtom';

export const SeparatorAtomView: React.FC<InterSeparatorAtom> = ({
  orientation = 'horizontal', className,
}) => (
  <PanelAtom variant="ghost" padding="none" radius="none"
    role="separator"
    aria-orientation={orientation}
    className={cn(
      'bg-neutral-200 shrink-0',
      orientation === 'horizontal' ? 'h-px w-full' : 'w-px h-full',
      className
    )}
  />
);

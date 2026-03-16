import React from 'react';
import { cn } from '../lib/cn';

interface SeparatorAtomProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const SeparatorAtom: React.FC<SeparatorAtomProps> = ({ orientation = 'horizontal', className }) => (
  <div
    role="separator"
    aria-orientation={orientation}
    className={cn('bg-neutral-200 shrink-0', orientation === 'horizontal' ? 'h-px w-full' : 'w-px h-full', className)}
  />
);

import React from 'react';
import { PanelAtom } from '../../atoms/PanelAtom/PanelAtom';
import { cn } from '../../lib/cn';
import type { InterCardLayout } from './InterCardLayout';

export const CardLayoutView = React.forwardRef<HTMLDivElement, InterCardLayout>(
  ({ children, className, ...props }, ref) => (
    <PanelAtom ref={ref} layout="card" className={cn('w-full max-w-full min-w-0', className)} {...props}>
      {children}
    </PanelAtom>
  )
);

CardLayoutView.displayName = 'CardLayoutView';

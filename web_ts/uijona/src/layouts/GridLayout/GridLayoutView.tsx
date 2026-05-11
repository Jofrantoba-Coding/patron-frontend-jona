import React from 'react';
import { PanelAtom } from '../../atoms/PanelAtom/PanelAtom';
import { cn } from '../../lib/cn';
import type { InterGridLayout } from './InterGridLayout';

export const GridLayoutView = React.forwardRef<HTMLDivElement, InterGridLayout>(
  ({ children, className, ...props }, ref) => (
    <PanelAtom ref={ref} layout="grid" className={cn('w-full max-w-full min-w-0', className)} {...props}>
      {children}
    </PanelAtom>
  )
);

GridLayoutView.displayName = 'GridLayoutView';

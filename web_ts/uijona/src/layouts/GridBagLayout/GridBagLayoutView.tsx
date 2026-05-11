import React from 'react';
import { PanelAtom } from '../../atoms/PanelAtom/PanelAtom';
import { cn } from '../../lib/cn';
import type { InterGridBagLayout } from './InterGridBagLayout';

export const GridBagLayoutView = React.forwardRef<HTMLDivElement, InterGridBagLayout>(
  ({ children, className, ...props }, ref) => (
    <PanelAtom ref={ref} layout="gridbag" className={cn('w-full max-w-full min-w-0', className)} {...props}>
      {children}
    </PanelAtom>
  )
);

GridBagLayoutView.displayName = 'GridBagLayoutView';

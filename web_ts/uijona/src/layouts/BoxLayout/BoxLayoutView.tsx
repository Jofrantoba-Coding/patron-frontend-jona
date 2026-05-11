import React from 'react';
import { PanelAtom } from '../../atoms/PanelAtom/PanelAtom';
import { cn } from '../../lib/cn';
import type { InterBoxLayout } from './InterBoxLayout';

export const BoxLayoutView = React.forwardRef<HTMLDivElement, InterBoxLayout>(
  ({ children, className, ...props }, ref) => (
    <PanelAtom ref={ref} layout="box" className={cn('w-full max-w-full min-w-0', className)} {...props}>
      {children}
    </PanelAtom>
  )
);

BoxLayoutView.displayName = 'BoxLayoutView';

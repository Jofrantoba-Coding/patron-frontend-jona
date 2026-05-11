import React from 'react';
import { PanelAtom } from '../../atoms/PanelAtom/PanelAtom';
import { cn } from '../../lib/cn';
import type { InterGroupLayout } from './InterGroupLayout';

export const GroupLayoutView = React.forwardRef<HTMLDivElement, InterGroupLayout>(
  ({ children, className, ...props }, ref) => (
    <PanelAtom ref={ref} layout="group" className={cn('w-full max-w-full min-w-0', className)} {...props}>
      {children}
    </PanelAtom>
  )
);

GroupLayoutView.displayName = 'GroupLayoutView';

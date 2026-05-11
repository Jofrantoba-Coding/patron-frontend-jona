import React from 'react';
import { PanelAtom } from '../../atoms/PanelAtom/PanelAtom';
import { cn } from '../../lib/cn';
import type { InterFlowLayout } from './InterFlowLayout';

export const FlowLayoutView = React.forwardRef<HTMLDivElement, InterFlowLayout>(
  ({ children, className, ...props }, ref) => (
    <PanelAtom ref={ref} layout="flow" className={cn('w-full max-w-full min-w-0', className)} {...props}>
      {children}
    </PanelAtom>
  )
);

FlowLayoutView.displayName = 'FlowLayoutView';

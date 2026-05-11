import React from 'react';
import { PanelAtom } from '../../atoms/PanelAtom/PanelAtom';
import { cn } from '../../lib/cn';
import type { InterSpringLayout } from './InterSpringLayout';

export const SpringLayoutView = React.forwardRef<HTMLDivElement, InterSpringLayout>(
  ({ children, className, ...props }, ref) => (
    <PanelAtom ref={ref} layout="spring" className={cn('w-full max-w-full min-w-0', className)} {...props}>
      {children}
    </PanelAtom>
  )
);

SpringLayoutView.displayName = 'SpringLayoutView';

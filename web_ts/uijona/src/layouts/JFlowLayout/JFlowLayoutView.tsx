import React from 'react';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { cn } from '../../lib/cn';
import type { InterJFlowLayout } from './InterJFlowLayout';

export const JFlowLayoutView = React.forwardRef<HTMLDivElement, InterJFlowLayout>(
  ({ children, className, ...props }, ref) => (
    <JPanel ref={ref} layout="flow" direction="row" className={cn('w-full max-w-full min-w-0', className)} {...props}>
      {children}
    </JPanel>
  )
);

JFlowLayoutView.displayName = 'JFlowLayoutView';

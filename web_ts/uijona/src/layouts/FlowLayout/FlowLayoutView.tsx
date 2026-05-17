import React from 'react';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { cn } from '../../lib/cn';
import type { InterFlowLayout } from './InterFlowLayout';

export const FlowLayoutView = React.forwardRef<HTMLDivElement, InterFlowLayout>(
  ({ children, className, ...props }, ref) => (
    <JPanel ref={ref} layout="flow" className={cn('w-full max-w-full min-w-0', className)} {...props}>
      {children}
    </JPanel>
  )
);

FlowLayoutView.displayName = 'FlowLayoutView';

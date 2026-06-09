import React from 'react';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { cn } from '../../lib/cn';
import type { InterJGridLayout } from './InterJGridLayout';

export const JGridLayoutView = React.forwardRef<HTMLDivElement, InterJGridLayout>(
  ({ children, className, ...props }, ref) => (
    <JPanel ref={ref} layout="grid" className={cn('w-full max-w-full min-w-0', className)} {...props}>
      {children}
    </JPanel>
  )
);

JGridLayoutView.displayName = 'JGridLayoutView';

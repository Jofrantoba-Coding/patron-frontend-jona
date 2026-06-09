import React from 'react';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { cn } from '../../lib/cn';
import type { InterJCardLayout } from './InterJCardLayout';

export const JCardLayoutView = React.forwardRef<HTMLDivElement, InterJCardLayout>(
  ({ children, className, ...props }, ref) => (
    <JPanel ref={ref} layout="card" className={cn('w-full max-w-full min-w-0', className)} {...props}>
      {children}
    </JPanel>
  )
);

JCardLayoutView.displayName = 'JCardLayoutView';

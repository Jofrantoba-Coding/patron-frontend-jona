import React from 'react';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { cn } from '../../lib/cn';
import type { InterJSpringLayout } from './InterJSpringLayout';

export const JSpringLayoutView = React.forwardRef<HTMLDivElement, InterJSpringLayout>(
  ({ children, className, ...props }, ref) => (
    <JPanel ref={ref} layout="spring" className={cn('w-full max-w-full min-w-0', className)} {...props}>
      {children}
    </JPanel>
  )
);

JSpringLayoutView.displayName = 'JSpringLayoutView';

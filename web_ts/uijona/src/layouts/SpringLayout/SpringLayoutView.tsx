import React from 'react';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { cn } from '../../lib/cn';
import type { InterSpringLayout } from './InterSpringLayout';

export const SpringLayoutView = React.forwardRef<HTMLDivElement, InterSpringLayout>(
  ({ children, className, ...props }, ref) => (
    <JPanel ref={ref} layout="spring" className={cn('w-full max-w-full min-w-0', className)} {...props}>
      {children}
    </JPanel>
  )
);

SpringLayoutView.displayName = 'SpringLayoutView';

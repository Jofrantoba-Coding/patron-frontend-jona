import React from 'react';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { cn } from '../../lib/cn';
import type { InterJBoxLayout } from './InterJBoxLayout';

export const JBoxLayoutView = React.forwardRef<HTMLDivElement, InterJBoxLayout>(
  ({ children, className, ...props }, ref) => (
    <JPanel ref={ref} layout="box" className={cn('w-full max-w-full min-w-0', className)} {...props}>
      {children}
    </JPanel>
  )
);

JBoxLayoutView.displayName = 'JBoxLayoutView';

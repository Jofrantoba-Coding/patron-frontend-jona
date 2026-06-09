import React from 'react';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { cn } from '../../lib/cn';
import type { InterJGridBagLayout } from './InterJGridBagLayout';

export const JGridBagLayoutView = React.forwardRef<HTMLDivElement, InterJGridBagLayout>(
  ({ children, className, ...props }, ref) => (
    <JPanel ref={ref} layout="gridbag" className={cn('w-full max-w-full min-w-0', className)} {...props}>
      {children}
    </JPanel>
  )
);

JGridBagLayoutView.displayName = 'JGridBagLayoutView';

import React from 'react';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { cn } from '../../lib/cn';
import type { InterCardLayout } from './InterCardLayout';

export const CardLayoutView = React.forwardRef<HTMLDivElement, InterCardLayout>(
  ({ children, className, ...props }, ref) => (
    <JPanel ref={ref} layout="card" className={cn('w-full max-w-full min-w-0', className)} {...props}>
      {children}
    </JPanel>
  )
);

CardLayoutView.displayName = 'CardLayoutView';

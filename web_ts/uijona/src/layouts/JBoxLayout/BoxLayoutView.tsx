import React from 'react';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { cn } from '../../lib/cn';
import type { InterBoxLayout } from './InterBoxLayout';

export const BoxLayoutView = React.forwardRef<HTMLDivElement, InterBoxLayout>(
  ({ children, className, ...props }, ref) => (
    <JPanel ref={ref} layout="box" className={cn('w-full max-w-full min-w-0', className)} {...props}>
      {children}
    </JPanel>
  )
);

BoxLayoutView.displayName = 'BoxLayoutView';

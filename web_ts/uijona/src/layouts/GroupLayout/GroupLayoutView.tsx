import React from 'react';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { cn } from '../../lib/cn';
import type { InterGroupLayout } from './InterGroupLayout';

export const GroupLayoutView = React.forwardRef<HTMLDivElement, InterGroupLayout>(
  ({ children, className, ...props }, ref) => (
    <JPanel ref={ref} layout="group" className={cn('w-full max-w-full min-w-0', className)} {...props}>
      {children}
    </JPanel>
  )
);

GroupLayoutView.displayName = 'GroupLayoutView';

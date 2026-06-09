import React from 'react';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { cn } from '../../lib/cn';
import type { InterJGroupLayout } from './InterJGroupLayout';

export const JGroupLayoutView = React.forwardRef<HTMLDivElement, InterJGroupLayout>(
  ({ children, className, ...props }, ref) => (
    <JPanel ref={ref} layout="group" className={cn('w-full max-w-full min-w-0', className)} {...props}>
      {children}
    </JPanel>
  )
);

JGroupLayoutView.displayName = 'JGroupLayoutView';

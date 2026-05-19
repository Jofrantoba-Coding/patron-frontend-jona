import React from 'react';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { cn } from '../../lib/cn';
import type { InterGridLayout } from './InterGridLayout';

export const GridLayoutView = React.forwardRef<HTMLDivElement, InterGridLayout>(
  ({ children, className, ...props }, ref) => (
    <JPanel ref={ref} layout="grid" className={cn('w-full max-w-full min-w-0', className)} {...props}>
      {children}
    </JPanel>
  )
);

GridLayoutView.displayName = 'GridLayoutView';

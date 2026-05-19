import React from 'react';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { cn } from '../../lib/cn';
import type { InterGridBagLayout } from './InterGridBagLayout';

export const GridBagLayoutView = React.forwardRef<HTMLDivElement, InterGridBagLayout>(
  ({ children, className, ...props }, ref) => (
    <JPanel ref={ref} layout="gridbag" className={cn('w-full max-w-full min-w-0', className)} {...props}>
      {children}
    </JPanel>
  )
);

GridBagLayoutView.displayName = 'GridBagLayoutView';

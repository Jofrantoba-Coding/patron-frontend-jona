import React from 'react';
import { PanelAtom } from '../../atoms/PanelAtom/PanelAtom';
import type { InterCardLayout } from './InterCardLayout';

export const CardLayoutView = React.forwardRef<HTMLDivElement, InterCardLayout>(
  ({ children, ...props }, ref) => (
    <PanelAtom ref={ref} layout="card" {...props}>
      {children}
    </PanelAtom>
  )
);

CardLayoutView.displayName = 'CardLayoutView';

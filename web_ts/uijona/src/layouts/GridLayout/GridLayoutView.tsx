import React from 'react';
import { PanelAtom } from '../../atoms/PanelAtom/PanelAtom';
import type { InterGridLayout } from './InterGridLayout';

export const GridLayoutView = React.forwardRef<HTMLDivElement, InterGridLayout>(
  ({ children, ...props }, ref) => (
    <PanelAtom ref={ref} layout="grid" {...props}>
      {children}
    </PanelAtom>
  )
);

GridLayoutView.displayName = 'GridLayoutView';

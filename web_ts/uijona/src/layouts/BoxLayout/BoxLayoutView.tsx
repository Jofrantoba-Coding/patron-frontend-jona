import React from 'react';
import { PanelAtom } from '../../atoms/PanelAtom/PanelAtom';
import type { InterBoxLayout } from './InterBoxLayout';

export const BoxLayoutView = React.forwardRef<HTMLDivElement, InterBoxLayout>(
  ({ children, ...props }, ref) => (
    <PanelAtom ref={ref} layout="box" {...props}>
      {children}
    </PanelAtom>
  )
);

BoxLayoutView.displayName = 'BoxLayoutView';

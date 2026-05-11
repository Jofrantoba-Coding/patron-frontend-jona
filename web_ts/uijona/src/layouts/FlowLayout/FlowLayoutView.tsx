import React from 'react';
import { PanelAtom } from '../../atoms/PanelAtom/PanelAtom';
import type { InterFlowLayout } from './InterFlowLayout';

export const FlowLayoutView = React.forwardRef<HTMLDivElement, InterFlowLayout>(
  ({ children, ...props }, ref) => (
    <PanelAtom ref={ref} layout="flow" {...props}>
      {children}
    </PanelAtom>
  )
);

FlowLayoutView.displayName = 'FlowLayoutView';

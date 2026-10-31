// JFieldGridView.tsx — JONA View (pure render)
import React from 'react';
import { cn } from '../../lib/cn';
import type { JPanelGap } from '../../atoms/JPanel';
import { InterJFieldGrid } from './InterJFieldGrid';

export type JFieldGridViewProps = Required<InterJFieldGrid>;

/** The JPanel gap scale (0, 0.25, 0.5, 1, 1.5, 2 rem) as literal classes (D4). */
const GAP_CLASSES: Record<JPanelGap, string> = {
  none: 'gap-0',
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
};

export const JFieldGridView: React.FC<JFieldGridViewProps> = ({ children, gap }) => (
  <div className={cn('grid w-full min-w-0 grid-cols-12', GAP_CLASSES[gap])}>
    {children}
  </div>
);

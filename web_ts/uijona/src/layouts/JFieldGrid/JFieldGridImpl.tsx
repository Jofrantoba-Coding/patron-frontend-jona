// JFieldGridImpl.tsx — JONA Implementation
import React from 'react';
import { InterJFieldGrid, JFIELDGRID_DEFAULTS } from './InterJFieldGrid';
import { JFieldGridView } from './JFieldGridView';

export const JFieldGridImpl: React.FC<InterJFieldGrid> = ({ children, gap }) => (
  <JFieldGridView gap={gap ?? JFIELDGRID_DEFAULTS.gap}>{children}</JFieldGridView>
);

JFieldGridImpl.displayName = 'JFieldGrid';

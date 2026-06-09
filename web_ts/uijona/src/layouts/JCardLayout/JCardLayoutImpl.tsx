import React from 'react';
import { JCARD_LAYOUT_DEFAULTS, type InterJCardLayout } from './InterJCardLayout';
import { JCardLayoutView } from './JCardLayoutView';

export const JCardLayoutImpl = React.forwardRef<HTMLDivElement, InterJCardLayout>(
  (props, ref) => <JCardLayoutView ref={ref} {...JCARD_LAYOUT_DEFAULTS} {...props} />
);

JCardLayoutImpl.displayName = 'JCardLayout';

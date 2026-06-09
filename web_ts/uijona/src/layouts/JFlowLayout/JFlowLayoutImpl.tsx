import React from 'react';
import { JFLOW_LAYOUT_DEFAULTS, type InterJFlowLayout } from './InterJFlowLayout';
import { JFlowLayoutView } from './JFlowLayoutView';

export const JFlowLayoutImpl = React.forwardRef<HTMLDivElement, InterJFlowLayout>(
  (props, ref) => <JFlowLayoutView ref={ref} {...JFLOW_LAYOUT_DEFAULTS} {...props} />
);

JFlowLayoutImpl.displayName = 'JFlowLayout';

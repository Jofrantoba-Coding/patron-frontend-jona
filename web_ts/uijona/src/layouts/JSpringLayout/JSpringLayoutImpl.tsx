import React from 'react';
import { JSPRING_LAYOUT_DEFAULTS, type InterJSpringLayout } from './InterJSpringLayout';
import { JSpringLayoutView } from './JSpringLayoutView';

export const JSpringLayoutImpl = React.forwardRef<HTMLDivElement, InterJSpringLayout>(
  (props, ref) => (
    <JSpringLayoutView ref={ref} {...JSPRING_LAYOUT_DEFAULTS} {...props} />
  )
);

JSpringLayoutImpl.displayName = 'JSpringLayout';

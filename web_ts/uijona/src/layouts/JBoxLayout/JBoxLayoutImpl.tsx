import React from 'react';
import { JBOX_LAYOUT_DEFAULTS, type InterJBoxLayout } from './InterJBoxLayout';
import { JBoxLayoutView } from './JBoxLayoutView';

export const JBoxLayoutImpl = React.forwardRef<HTMLDivElement, InterJBoxLayout>(
  (props, ref) => (
    <JBoxLayoutView ref={ref} {...JBOX_LAYOUT_DEFAULTS} {...props} />
  )
);

JBoxLayoutImpl.displayName = 'JBoxLayout';

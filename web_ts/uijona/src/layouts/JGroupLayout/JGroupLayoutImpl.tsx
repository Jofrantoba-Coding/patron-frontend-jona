import React from 'react';
import { JGROUP_LAYOUT_DEFAULTS, type InterJGroupLayout } from './InterJGroupLayout';
import { JGroupLayoutView } from './JGroupLayoutView';

export const JGroupLayoutImpl = React.forwardRef<HTMLDivElement, InterJGroupLayout>(
  (props, ref) => (
    <JGroupLayoutView ref={ref} {...JGROUP_LAYOUT_DEFAULTS} {...props} />
  )
);

JGroupLayoutImpl.displayName = 'JGroupLayout';

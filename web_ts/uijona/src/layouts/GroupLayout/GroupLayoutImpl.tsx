import React from 'react';
import { GROUP_LAYOUT_DEFAULTS, type InterGroupLayout } from './InterGroupLayout';
import { GroupLayoutView } from './GroupLayoutView';

export const GroupLayoutImpl = React.forwardRef<HTMLDivElement, InterGroupLayout>(
  (props, ref) => (
    <GroupLayoutView ref={ref} {...GROUP_LAYOUT_DEFAULTS} {...props} />
  )
);

GroupLayoutImpl.displayName = 'GroupLayout';

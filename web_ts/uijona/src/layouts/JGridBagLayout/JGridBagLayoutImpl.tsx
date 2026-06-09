import React from 'react';
import { JGRID_BAG_LAYOUT_DEFAULTS, type InterJGridBagLayout } from './InterJGridBagLayout';
import { JGridBagLayoutView } from './JGridBagLayoutView';

export const JGridBagLayoutImpl = React.forwardRef<HTMLDivElement, InterJGridBagLayout>(
  (props, ref) => (
    <JGridBagLayoutView ref={ref} {...JGRID_BAG_LAYOUT_DEFAULTS} {...props} />
  )
);

JGridBagLayoutImpl.displayName = 'JGridBagLayout';

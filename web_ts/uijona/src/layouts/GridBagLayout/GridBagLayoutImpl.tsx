import React from 'react';
import { GRID_BAG_LAYOUT_DEFAULTS, type InterGridBagLayout } from './InterGridBagLayout';
import { GridBagLayoutView } from './GridBagLayoutView';

export const GridBagLayoutImpl = React.forwardRef<HTMLDivElement, InterGridBagLayout>(
  (props, ref) => (
    <GridBagLayoutView ref={ref} {...GRID_BAG_LAYOUT_DEFAULTS} {...props} />
  )
);

GridBagLayoutImpl.displayName = 'GridBagLayout';

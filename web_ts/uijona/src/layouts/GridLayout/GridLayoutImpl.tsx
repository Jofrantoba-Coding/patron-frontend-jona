import React from 'react';
import { GRID_LAYOUT_DEFAULTS, type InterGridLayout } from './InterGridLayout';
import { GridLayoutView } from './GridLayoutView';

export const GridLayoutImpl = React.forwardRef<HTMLDivElement, InterGridLayout>(
  (props, ref) => <GridLayoutView ref={ref} {...GRID_LAYOUT_DEFAULTS} {...props} />
);

GridLayoutImpl.displayName = 'GridLayout';

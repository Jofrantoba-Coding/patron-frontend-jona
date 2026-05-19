import React from 'react';
import { GRID_LAYOUT_DEFAULTS, type InterGridLayout } from './InterGridLayout';
import { GridLayoutView } from './GridLayoutView';

export const GridLayoutImpl = React.forwardRef<HTMLDivElement, InterGridLayout>(
  (props, ref) => {
    const resolved: InterGridLayout = { ...GRID_LAYOUT_DEFAULTS, ...props };

    if (props.columns !== undefined && props.autoFitMin === undefined) {
      resolved.autoFitMin = undefined;
    }

    return <GridLayoutView ref={ref} {...resolved} />;
  }
);

GridLayoutImpl.displayName = 'JGridLayout';

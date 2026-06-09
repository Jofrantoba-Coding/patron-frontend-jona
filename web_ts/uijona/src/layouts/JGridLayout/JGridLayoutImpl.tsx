import React from 'react';
import { JGRID_LAYOUT_DEFAULTS, type InterJGridLayout } from './InterJGridLayout';
import { JGridLayoutView } from './JGridLayoutView';

export const JGridLayoutImpl = React.forwardRef<HTMLDivElement, InterJGridLayout>(
  (props, ref) => {
    const resolved: InterJGridLayout = { ...JGRID_LAYOUT_DEFAULTS, ...props };

    if (props.columns !== undefined && props.autoFitMin === undefined) {
      resolved.autoFitMin = undefined;
    }

    return <JGridLayoutView ref={ref} {...resolved} />;
  }
);

JGridLayoutImpl.displayName = 'JGridLayout';

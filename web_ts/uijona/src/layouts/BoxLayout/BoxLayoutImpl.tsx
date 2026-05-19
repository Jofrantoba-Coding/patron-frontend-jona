import React from 'react';
import { BOX_LAYOUT_DEFAULTS, type InterBoxLayout } from './InterBoxLayout';
import { BoxLayoutView } from './BoxLayoutView';

export const BoxLayoutImpl = React.forwardRef<HTMLDivElement, InterBoxLayout>(
  (props, ref) => {
    const direction = props.direction ?? BOX_LAYOUT_DEFAULTS.direction;
    const wrap = props.wrap ?? (direction === 'column' ? 'nowrap' : BOX_LAYOUT_DEFAULTS.wrap);

    return (
      <BoxLayoutView
        ref={ref}
        {...BOX_LAYOUT_DEFAULTS}
        {...props}
        direction={direction}
        wrap={wrap}
      />
    );
  }
);

BoxLayoutImpl.displayName = 'JBoxLayout';

import React from 'react';
import { BOX_LAYOUT_DEFAULTS, type InterBoxLayout } from './InterBoxLayout';
import { BoxLayoutView } from './BoxLayoutView';

export const BoxLayoutImpl = React.forwardRef<HTMLDivElement, InterBoxLayout>(
  (props, ref) => <BoxLayoutView ref={ref} {...BOX_LAYOUT_DEFAULTS} {...props} />
);

BoxLayoutImpl.displayName = 'BoxLayout';

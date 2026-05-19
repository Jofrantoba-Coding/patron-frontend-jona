import React from 'react';
import { CARD_LAYOUT_DEFAULTS, type InterCardLayout } from './InterCardLayout';
import { CardLayoutView } from './CardLayoutView';

export const CardLayoutImpl = React.forwardRef<HTMLDivElement, InterCardLayout>(
  (props, ref) => <CardLayoutView ref={ref} {...CARD_LAYOUT_DEFAULTS} {...props} />
);

CardLayoutImpl.displayName = 'JCardLayout';

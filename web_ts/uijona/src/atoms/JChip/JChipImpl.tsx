import React from 'react';
import { JCHIP_DEFAULTS, InterJChip } from './InterJChip';
import { JChipView } from './JChipView';

type JChipImplProps = InterJChip &
  Omit<React.HTMLAttributes<HTMLSpanElement>, 'className' | 'style' | 'children' | 'onClick'>;

export const JChipImpl = React.forwardRef<HTMLSpanElement, JChipImplProps>(
  (props, ref) => <JChipView {...JCHIP_DEFAULTS} {...props} forwardedRef={ref} />
);

JChipImpl.displayName = 'JChip';

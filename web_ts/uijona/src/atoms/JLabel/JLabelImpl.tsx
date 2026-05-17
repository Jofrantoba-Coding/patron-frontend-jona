import React from 'react';
import { InterJLabel, JLABEL_DEFAULTS } from './InterJLabel';
import { JLabelView } from './JLabelView';

export const JLabelImpl = React.forwardRef<HTMLElement, InterJLabel>(
  (props, ref) => <JLabelView {...JLABEL_DEFAULTS} {...props} forwardedRef={ref} />
);

JLabelImpl.displayName = 'JLabel';

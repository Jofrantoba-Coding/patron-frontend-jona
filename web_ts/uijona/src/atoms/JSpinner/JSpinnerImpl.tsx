import React from 'react';
import { JSPINNER_DEFAULTS, InterJSpinner } from './InterJSpinner';
import { JSpinnerView } from './JSpinnerView';

type JSpinnerImplProps = InterJSpinner &
  Omit<React.HTMLAttributes<HTMLSpanElement>, 'className' | 'style' | 'children'>;

export const JSpinnerImpl = React.forwardRef<HTMLSpanElement, JSpinnerImplProps>(
  (props, ref) => <JSpinnerView {...JSPINNER_DEFAULTS} {...props} forwardedRef={ref} />
);

JSpinnerImpl.displayName = 'JSpinner';

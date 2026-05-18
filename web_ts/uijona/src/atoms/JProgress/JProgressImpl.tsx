import React from 'react';
import { JPROGRESS_DEFAULTS, InterJProgress } from './InterJProgress';
import { JProgressView } from './JProgressView';

type JProgressImplProps = InterJProgress &
  Omit<React.HTMLAttributes<HTMLDivElement>, 'className' | 'style' | 'children'>;

export const JProgressImpl = React.forwardRef<HTMLDivElement, JProgressImplProps>(
  (props, ref) => <JProgressView {...JPROGRESS_DEFAULTS} {...props} forwardedRef={ref} />
);

JProgressImpl.displayName = 'JProgress';

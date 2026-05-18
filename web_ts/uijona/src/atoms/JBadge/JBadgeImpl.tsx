import React from 'react';
import { InterJBadge, JBADGE_DEFAULTS } from './InterJBadge';
import { JBadgeView } from './JBadgeView';

type JBadgeImplProps = InterJBadge &
  Omit<React.HTMLAttributes<HTMLSpanElement>, 'className' | 'style' | 'children'>;

export const JBadgeImpl = React.forwardRef<HTMLSpanElement, JBadgeImplProps>(
  (props, ref) => <JBadgeView {...JBADGE_DEFAULTS} {...props} forwardedRef={ref} />
);
JBadgeImpl.displayName = 'JBadge';

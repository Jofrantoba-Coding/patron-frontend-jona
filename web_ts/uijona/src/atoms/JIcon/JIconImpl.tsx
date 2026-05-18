import React from 'react';
import { JICON_DEFAULTS, InterJIcon } from './InterJIcon';
import { JIconView } from './JIconView';

type JIconImplProps = InterJIcon &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'style' | 'children'>;

export const JIconImpl = React.forwardRef<HTMLButtonElement, JIconImplProps>(
  (props, ref) => <JIconView {...JICON_DEFAULTS} {...props} forwardedRef={ref} />
);

JIconImpl.displayName = 'JIcon';

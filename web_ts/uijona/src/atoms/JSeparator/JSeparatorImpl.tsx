import React from 'react';
import { JSEPARATOR_DEFAULTS, InterJSeparator } from './InterJSeparator';
import { JSeparatorView } from './JSeparatorView';

type JSeparatorImplProps = InterJSeparator &
  Omit<React.HTMLAttributes<HTMLDivElement>, 'className' | 'style' | 'children'>;

export const JSeparatorImpl = React.forwardRef<HTMLDivElement, JSeparatorImplProps>(
  (props, ref) => <JSeparatorView {...JSEPARATOR_DEFAULTS} {...props} forwardedRef={ref} />
);

JSeparatorImpl.displayName = 'JSeparator';

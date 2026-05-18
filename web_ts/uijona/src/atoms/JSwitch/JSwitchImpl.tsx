import React from 'react';
import { JSWITCH_DEFAULTS, InterJSwitch } from './InterJSwitch';
import { JSwitchView } from './JSwitchView';

type JSwitchImplProps = InterJSwitch &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'style' | 'children' | 'onClick' | 'disabled'>;

export const JSwitchImpl = React.forwardRef<HTMLButtonElement, JSwitchImplProps>(
  (props, ref) => <JSwitchView {...JSWITCH_DEFAULTS} {...props} forwardedRef={ref} />
);

JSwitchImpl.displayName = 'JSwitch';

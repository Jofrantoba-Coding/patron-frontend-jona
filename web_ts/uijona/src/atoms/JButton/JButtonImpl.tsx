import React from 'react';
import { InterJButton, JBUTTON_DEFAULTS } from './InterJButton';
import { JButtonView } from './JButtonView';

type JButtonImplProps = InterJButton &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof InterJButton>;

export const JButtonImpl = React.forwardRef<HTMLButtonElement, JButtonImplProps>(
  (props, ref) => <JButtonView {...JBUTTON_DEFAULTS} {...props} forwardedRef={ref} />
);

JButtonImpl.displayName = 'JButton';

import React from 'react';
import { JRADIOBUTTON_DEFAULTS, InterJRadioButton } from './InterJRadioButton';
import { JRadioButtonView } from './JRadioButtonView';

type JRadioButtonImplProps = InterJRadioButton &
  Omit<React.InputHTMLAttributes<HTMLInputElement>,
    'className' | 'style' | 'onChange' | 'checked' | 'type' | 'disabled' | 'onFocus' | 'onBlur'
  >;

export const JRadioButtonImpl = React.forwardRef<HTMLInputElement, JRadioButtonImplProps>(
  (props, ref) => <JRadioButtonView {...JRADIOBUTTON_DEFAULTS} {...props} forwardedRef={ref} />
);

JRadioButtonImpl.displayName = 'JRadioButton';

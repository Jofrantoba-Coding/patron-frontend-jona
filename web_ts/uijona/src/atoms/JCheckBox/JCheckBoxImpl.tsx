import React from 'react';
import { InterJCheckBox, JCHECKBOX_DEFAULTS } from './InterJCheckBox';
import { JCheckBoxView } from './JCheckBoxView';

type JCheckBoxImplProps = InterJCheckBox &
  Omit<React.InputHTMLAttributes<HTMLInputElement>,
    | 'onChange' | 'onFocus' | 'onBlur'
    | 'checked' | 'defaultChecked' | 'size' | 'value'
  >;

export const JCheckBoxImpl = React.forwardRef<HTMLInputElement, JCheckBoxImplProps>(
  (props, ref) => <JCheckBoxView {...JCHECKBOX_DEFAULTS} {...props} forwardedRef={ref} />
);

JCheckBoxImpl.displayName = 'JCheckBox';

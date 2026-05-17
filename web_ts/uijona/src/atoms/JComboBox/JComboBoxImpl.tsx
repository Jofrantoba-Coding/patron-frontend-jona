import React from 'react';
import { InterJComboBox, JCOMBOBOX_DEFAULTS } from './InterJComboBox';
import { JComboBoxView } from './JComboBoxView';

type JComboBoxImplProps = InterJComboBox &
  Omit<React.SelectHTMLAttributes<HTMLSelectElement>,
    | 'onChange' | 'onFocus' | 'onBlur'
    | 'value' | 'size'
  >;

export const JComboBoxImpl = React.forwardRef<HTMLSelectElement, JComboBoxImplProps>(
  (props, ref) => <JComboBoxView {...JCOMBOBOX_DEFAULTS} {...props} forwardedRef={ref} />
);

JComboBoxImpl.displayName = 'JComboBox';

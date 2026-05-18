import React from 'react';

export type JRadioButtonLabelPosition = 'right' | 'left' | 'top' | 'bottom';

export interface InterJRadioButton {
  checked?: boolean;
  hasError?: boolean;
  disabled?: boolean;
  id?: string;
  name?: string;
  value?: string;
  label?: string;
  labelPosition?: JRadioButtonLabelPosition;
  labelClassName?: string;
  className?: string;
  style?: React.CSSProperties;
  onCheckedChange?: (checked: boolean, value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

export const JRADIOBUTTON_DEFAULTS = {
  hasError:      false,
  disabled:      false,
  labelPosition: 'right',
} as const satisfies Partial<InterJRadioButton>;

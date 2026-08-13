export type JRadioButtonLabelPosition = 'right' | 'left' | 'top' | 'bottom';

/** Contrato publico de JRadioButton. */
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
}

export const JRADIOBUTTON_DEFAULTS = {
  hasError: false,
  disabled: false,
  labelPosition: 'right',
} as const satisfies Pick<InterJRadioButton, 'hasError' | 'disabled' | 'labelPosition'>;


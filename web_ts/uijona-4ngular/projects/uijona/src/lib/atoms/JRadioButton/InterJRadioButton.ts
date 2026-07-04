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

export const JRADIOBUTTON_WRAPPER_CLASSES: Record<JRadioButtonLabelPosition, string> = {
  right: 'flex flex-row items-center gap-2',
  left: 'flex flex-row-reverse items-center gap-2',
  top: 'flex flex-col-reverse items-start gap-1',
  bottom: 'flex flex-col items-start gap-1',
};

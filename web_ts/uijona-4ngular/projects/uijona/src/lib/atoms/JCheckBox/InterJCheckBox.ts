export type JCheckBoxSize = 'sm' | 'md' | 'lg';
export type JCheckBoxLabelPosition = 'right' | 'left' | 'top' | 'bottom';

/** Contrato publico de JCheckBox. */
export interface InterJCheckBox {
  checked?: boolean;
  indeterminate?: boolean;
  hasError?: boolean;
  disabled?: boolean;
  size?: JCheckBoxSize;
  label?: string;
  labelPosition?: JCheckBoxLabelPosition;
  labelClassName?: string;
  id?: string;
  name?: string;
  value?: string;
}

export const JCHECKBOX_DEFAULTS = {
  hasError: false,
  disabled: false,
  indeterminate: false,
  size: 'md',
  labelPosition: 'right',
} as const satisfies Pick<
  InterJCheckBox,
  'hasError' | 'disabled' | 'indeterminate' | 'size' | 'labelPosition'
>;


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

export const JCHECKBOX_SIZE_CLASSES: Record<JCheckBoxSize, string> = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
};

export const JCHECKBOX_WRAPPER_CLASSES: Record<JCheckBoxLabelPosition, string> = {
  right: 'flex flex-row items-center gap-2',
  left: 'flex flex-row-reverse items-center gap-2',
  top: 'flex flex-col-reverse items-start gap-1',
  bottom: 'flex flex-col items-start gap-1',
};

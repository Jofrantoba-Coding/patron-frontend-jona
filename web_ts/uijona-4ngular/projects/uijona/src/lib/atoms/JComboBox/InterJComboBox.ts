export interface JComboBoxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface JComboBoxGroup {
  label: string;
  options: JComboBoxOption[];
}

export type JComboBoxSize = 'sm' | 'md' | 'lg';
export type JComboBoxVariant = 'default' | 'filled';

/** Contrato publico de JComboBox (select nativo). */
export interface InterJComboBox {
  options?: JComboBoxOption[];
  groups?: JComboBoxGroup[];
  placeholder?: string;
  value?: string;
  hasError?: boolean;
  disabled?: boolean;
  size?: JComboBoxSize;
  variant?: JComboBoxVariant;
  id?: string;
  name?: string;
  required?: boolean;
}

export const JCOMBOBOX_DEFAULTS = {
  hasError: false,
  disabled: false,
  size: 'md',
  variant: 'default',
} as const satisfies Required<
  Pick<InterJComboBox, 'hasError' | 'disabled' | 'size' | 'variant'>
>;


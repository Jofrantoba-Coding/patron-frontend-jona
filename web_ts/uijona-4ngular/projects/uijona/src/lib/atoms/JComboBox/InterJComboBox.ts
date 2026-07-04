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

export const JCOMBOBOX_SIZE_CLASSES: Record<JComboBoxSize, string> = {
  sm: 'h-7 text-xs px-2 py-0.5',
  md: 'h-9 text-sm px-3 py-1',
  lg: 'h-11 text-base px-4 py-2',
};

export const JCOMBOBOX_VARIANT_CLASSES: Record<JComboBoxVariant, string> = {
  default: 'bg-white border-neutral-300',
  filled: 'bg-neutral-50 border-neutral-200',
};

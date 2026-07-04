export type JTextBoxVariant = 'default' | 'filled' | 'ghost';
export type JTextBoxSize = 'sm' | 'md' | 'lg';

/** Contrato publico de JTextBox. Los iconos se proyectan con [jIconLeft]/[jIconRight]. */
export interface InterJTextBox {
  value?: string;
  placeholder?: string;
  name?: string;
  id?: string;
  variant?: JTextBoxVariant;
  size?: JTextBoxSize;
  type?: string;
  hasError?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  autoComplete?: string;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
}

export const JTEXTBOX_DEFAULTS = {
  variant: 'default',
  size: 'md',
  type: 'text',
  hasError: false,
} as const satisfies Required<Pick<InterJTextBox, 'variant' | 'size' | 'type' | 'hasError'>>;

export const JTEXTBOX_VARIANT_CLASSES: Record<JTextBoxVariant, string> = {
  default: 'border border-neutral-300 bg-neutral-50 text-neutral-900',
  filled: 'border-0 bg-neutral-100 text-neutral-900',
  ghost: 'border-0 bg-transparent text-neutral-900',
};

export const JTEXTBOX_SIZE_CLASSES: Record<JTextBoxSize, string> = {
  sm: 'h-7 px-3 text-xs rounded',
  md: 'h-9 px-3 text-sm rounded-md',
  lg: 'h-11 px-4 text-base rounded-md',
};

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


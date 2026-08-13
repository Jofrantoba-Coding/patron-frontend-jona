export type JTextAreaResize = 'none' | 'vertical' | 'horizontal' | 'both';
export type JTextAreaSize = 'sm' | 'md' | 'lg';
export type JTextAreaVariant = 'default' | 'filled';

/** Contrato publico de JTextArea. */
export interface InterJTextArea {
  value?: string;
  hasError?: boolean;
  autoResize?: boolean;
  resize?: JTextAreaResize;
  disabled?: boolean;
  size?: JTextAreaSize;
  variant?: JTextAreaVariant;
  id?: string;
  name?: string;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  maxLength?: number;
}

export const JTEXTAREA_DEFAULTS = {
  hasError: false,
  autoResize: false,
  resize: 'both',
  disabled: false,
  size: 'md',
  variant: 'default',
} as const satisfies Required<
  Pick<InterJTextArea, 'hasError' | 'autoResize' | 'resize' | 'disabled' | 'size' | 'variant'>
>;


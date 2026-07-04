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

export const JTEXTAREA_RESIZE_CLASSES: Record<JTextAreaResize, string> = {
  none: 'resize-none',
  vertical: 'resize-y',
  horizontal: 'resize-x',
  both: 'resize',
};

export const JTEXTAREA_SIZE_CLASSES: Record<JTextAreaSize, string> = {
  sm: 'min-h-[60px] text-xs px-2 py-1.5',
  md: 'min-h-[80px] text-sm px-3 py-2',
  lg: 'min-h-[100px] text-base px-4 py-2.5',
};

export const JTEXTAREA_VARIANT_CLASSES: Record<JTextAreaVariant, string> = {
  default: 'bg-white border-neutral-300',
  filled: 'bg-neutral-50 border-neutral-200',
};

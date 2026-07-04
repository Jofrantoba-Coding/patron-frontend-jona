export type JLabelVariant =
  | 'body'
  | 'heading'
  | 'label'
  | 'link'
  | 'link-muted'
  | 'link-button'
  | 'link-danger'
  | 'error'
  | 'description';

export type JLabelSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl';
export type JLabelColor = 'default' | 'muted' | 'primary' | 'danger' | 'success' | 'warning';
export type JLabelAs =
  | 'p'
  | 'span'
  | 'div'
  | 'strong'
  | 'em'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'label'
  | 'a';

/** Contrato publico de JLabel. */
export interface InterJLabel {
  /** Elemento HTML a renderizar (se infiere del variant si no se pasa). */
  as?: JLabelAs;
  variant?: JLabelVariant;
  size?: JLabelSize;
  color?: JLabelColor;
  truncate?: boolean;
  /** as="label": id del control asociado. */
  htmlFor?: string;
  required?: boolean;
  href?: string;
  target?: string;
  rel?: string;
  /** Compat: se usa como contenido si no hay contenido proyectado. */
  message?: string;
  disabled?: boolean;
}

export const JLABEL_DEFAULTS = {
  variant: 'body',
  color: 'default',
  truncate: false,
  required: false,
  disabled: false,
} as const satisfies Required<
  Pick<InterJLabel, 'variant' | 'color' | 'truncate' | 'required' | 'disabled'>
>;

export const JLABEL_VARIANT_CLASSES: Record<JLabelVariant, string> = {
  body: 'text-neutral-900',
  heading: 'font-semibold text-neutral-900',
  label: 'text-sm font-medium text-neutral-700',
  link: 'text-primary-600 underline-offset-4 hover:underline cursor-pointer',
  'link-muted': 'text-neutral-500 underline-offset-4 hover:underline cursor-pointer',
  'link-button':
    'inline-flex items-center justify-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 cursor-pointer',
  'link-danger': 'text-danger-500 underline-offset-4 hover:underline cursor-pointer',
  error: 'text-xs text-danger-500',
  description: 'text-xs text-neutral-500',
};

export const JLABEL_VARIANT_DEFAULT_AS: Record<JLabelVariant, JLabelAs> = {
  body: 'p',
  heading: 'p',
  label: 'label',
  link: 'a',
  'link-muted': 'a',
  'link-button': 'a',
  'link-danger': 'a',
  error: 'p',
  description: 'p',
};

export const JLABEL_VARIANT_DEFAULT_SIZE: Partial<Record<JLabelVariant, JLabelSize>> = {
  body: 'base',
  label: 'sm',
  error: 'xs',
  description: 'xs',
};

export const JLABEL_SIZE_CLASSES: Record<JLabelSize, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
};

export const JLABEL_COLOR_CLASSES: Record<JLabelColor, string> = {
  default: '',
  muted: 'text-neutral-500',
  primary: 'text-primary-600',
  danger: 'text-danger-500',
  success: 'text-success-600',
  warning: 'text-warning-600',
};

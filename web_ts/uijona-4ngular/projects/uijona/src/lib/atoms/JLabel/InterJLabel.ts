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


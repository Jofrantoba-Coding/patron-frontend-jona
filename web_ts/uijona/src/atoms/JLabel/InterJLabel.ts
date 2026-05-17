import React from 'react';

export type JLabelVariant =
  | 'body'          // texto de cuerpo (TextAtom default)
  | 'heading'       // título, usa con as="h1-h6"
  | 'label'         // etiqueta de formulario (LabelAtom)
  | 'link'          // enlace primario (LinkAtom default)
  | 'link-muted'    // enlace neutro
  | 'link-button'   // enlace con apariencia de botón
  | 'link-danger'   // enlace de peligro
  | 'error'         // mensaje de error, role="alert" (ErrorMessageAtom)
  | 'description';  // texto descriptivo auxiliar

export type JLabelSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl';

export type JLabelColor = 'default' | 'muted' | 'primary' | 'danger' | 'success' | 'warning';

export type JLabelAs =
  | 'p' | 'span' | 'div' | 'strong' | 'em'
  | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  | 'label' | 'a';

export interface InterJLabel extends Omit<React.HTMLAttributes<HTMLElement>, 'color'> {
  // Elemento HTML a renderizar (se infiere del variant si no se pasa)
  as?: JLabelAs;

  // Estilo semántico
  variant?: JLabelVariant;

  // Texto
  size?: JLabelSize;
  color?: JLabelColor;
  truncate?: boolean;

  // Formulario (as="label" o variant="label")
  htmlFor?: string;
  required?: boolean;

  // Enlace (as="a" o variant link-*)
  href?: string;
  target?: string;
  rel?: string;

  // Compatibilidad ErrorMessageAtom — se usa como children si no hay children
  message?: string;

  // Estado
  disabled?: boolean;

  // Estándar
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const JLABEL_DEFAULTS = {
  variant:  'body',
  color:    'default',
  truncate: false,
  required: false,
  disabled: false,
} as const satisfies Required<Pick<InterJLabel, 'variant' | 'color' | 'truncate' | 'required' | 'disabled'>>;

export const JLABEL_VARIANTS: Record<JLabelVariant, string> = {
  'body':         'Texto de cuerpo. Elemento por defecto: p.',
  'heading':      'Título semibold. Usar con as="h1-h6".',
  'label':        'Etiqueta de formulario. Elemento por defecto: label. Muestra * si required.',
  'link':         'Enlace primario con subrayado al hover. Elemento por defecto: a.',
  'link-muted':   'Enlace neutro. Elemento por defecto: a.',
  'link-button':  'Enlace con apariencia de botón primario. Elemento por defecto: a.',
  'link-danger':  'Enlace de peligro. Elemento por defecto: a.',
  'error':        'Mensaje de error. role="alert", rojo. Se oculta si no hay contenido.',
  'description':  'Texto descriptivo auxiliar neutro. Se oculta si no hay contenido.',
};

export const JLABEL_SIZES: Record<JLabelSize, string> = {
  'xs':  'text-xs  — 12px',
  'sm':  'text-sm  — 14px',
  'base':'text-base — 16px (body default)',
  'lg':  'text-lg  — 18px',
  'xl':  'text-xl  — 20px',
  '2xl': 'text-2xl — 24px',
};

export const JLABEL_COLORS: Record<JLabelColor, string> = {
  default: 'neutral-900. Hereda del variant.',
  muted:   'neutral-500. Texto secundario.',
  primary: 'primary-600. Énfasis de marca.',
  danger:  'danger-500. Crítico o error.',
  success: 'success-600. Confirmación.',
  warning: 'warning-600. Advertencia.',
};

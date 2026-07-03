import React from 'react';

export type JButtonVariant = 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary' | 'link' | 'accent';
export type JButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'icon' | 'default';
export type JButtonIconPosition = 'left' | 'right' | 'top' | 'bottom';

export interface InterJButton {
  children?: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: JButtonIconPosition;
  variant?: JButtonVariant;
  size?: JButtonSize;
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  // Cuando se define href, el botón se renderiza como <a> (link con estilo de botón)
  href?: string;
  target?: string;
  rel?: string;
  // Fusiona el estilo de botón sobre el ÚNICO hijo (patrón asChild).
  // Útil para envolver <Link> de un router conservando su tipado y la navegación SPA.
  asChild?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLButtonElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLButtonElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
}

export const JBUTTON_DEFAULTS = {
  variant: 'default',
  size: 'md',
  iconPosition: 'left',
  loading: false,
  fullWidth: false,
  type: 'button',
} as const satisfies Required<Pick<InterJButton, 'variant' | 'size' | 'iconPosition' | 'loading' | 'fullWidth' | 'type'>>;

export const JBUTTON_VARIANTS: Record<JButtonVariant, string> = {
  default:     'Filled. Color primario, acción principal.',
  outline:     'Borde y texto, sin relleno. Acción secundaria.',
  ghost:       'Sin borde ni relleno. Acción terciaria.',
  destructive: 'Rojo. Acciones destructivas.',
  secondary:   'Neutral. Acciones complementarias.',
  link:        'Solo texto subrayado. Navegación inline.',
  accent:      'Filled. Color de acento (secundario de marca).',
};

export const JBUTTON_SIZES: Record<JButtonSize, string> = {
  xs:      '24px min-height. Espacios muy comprimidos.',
  sm:      '28px min-height. Dentro de tablas o listas.',
  md:      '36px min-height. Tamaño por defecto.',
  default: '36px min-height. Alias de md para compat.',
  lg:      '44px min-height. Acciones destacadas.',
  xl:      '56px min-height. Hero o calls to action.',
  icon:    '36×36 cuadrado. Solo icono, sin texto.',
};

export const JBUTTON_ICON_POSITIONS: Record<JButtonIconPosition, string> = {
  left:   'Icono antes del texto (default). flex-direction: row.',
  right:  'Icono después del texto. flex-direction: row-reverse.',
  top:    'Icono sobre el texto. flex-direction: column.',
  bottom: 'Icono bajo el texto. flex-direction: column-reverse.',
};

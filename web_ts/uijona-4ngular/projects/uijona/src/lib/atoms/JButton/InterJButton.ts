// InterJButton.ts — JONA Contrato
// Capa agnostica: tipos, valores por defecto y documentacion de cada opcion.
// NO contiene clases de Tailwind ni detalles de presentacion: eso vive en JButtonStyles.ts.

export type JButtonVariant =
  | 'default'
  | 'outline'
  | 'ghost'
  | 'destructive'
  | 'secondary'
  | 'link'
  | 'accent';
export type JButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'icon' | 'default';
export type JButtonIconPosition = 'left' | 'right' | 'top' | 'bottom';
export type JButtonType = 'button' | 'submit' | 'reset';

/** Contrato publico de JButton. */
export interface InterJButton {
  variant?: JButtonVariant;
  size?: JButtonSize;
  iconPosition?: JButtonIconPosition;
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  type?: JButtonType;
  /** Cuando se define href, el boton se renderiza como <a> (link con estilo de boton). */
  href?: string;
  target?: string;
  rel?: string;
  /**
   * @deprecated Sin efecto visual. El espaciado solo-icono se resuelve en CSS:
   * `.jbutton-text:empty { display: none }` elimina el hueco del flex gap.
   * Se mantiene por compatibilidad y se retirara en la proxima mayor.
   */
  iconOnly?: boolean;
  ariaLabel?: string;
  className?: string;

  // Observer events — el nombre entre parentesis es el output de Angular.
  /** (clicked) */
  onClick?: (event: MouseEvent) => void;
  /** (focused) */
  onFocus?: (event: FocusEvent) => void;
  /** (blurred) */
  onBlur?: (event: FocusEvent) => void;
  /** (keydown) */
  onKeyDown?: (event: KeyboardEvent) => void;
}

export const JBUTTON_DEFAULTS = {
  variant: 'default',
  size: 'md',
  iconPosition: 'left',
  loading: false,
  fullWidth: false,
  type: 'button',
} as const satisfies Required<
  Pick<InterJButton, 'variant' | 'size' | 'iconPosition' | 'loading' | 'fullWidth' | 'type'>
>;

/** Documentacion de cada variante — consumida por Storybook y por las guias de uso. */
export const JBUTTON_VARIANTS: Record<JButtonVariant, string> = {
  default: 'Filled. Color primario, accion principal.',
  outline: 'Borde y texto, sin relleno. Accion secundaria.',
  ghost: 'Sin borde ni relleno. Accion terciaria.',
  destructive: 'Rojo. Acciones destructivas.',
  secondary: 'Neutral. Acciones complementarias.',
  link: 'Solo texto subrayado. Navegacion inline.',
  accent: 'Filled. Color de acento (secundario de marca).',
};

export const JBUTTON_SIZES: Record<JButtonSize, string> = {
  xs: '24px min-height. Espacios muy comprimidos.',
  sm: '28px min-height. Dentro de tablas o listas.',
  md: '36px min-height. Tamano por defecto.',
  default: '36px min-height. Alias de md para compat.',
  lg: '44px min-height. Acciones destacadas.',
  xl: '56px min-height. Hero o calls to action.',
  icon: '36x36 cuadrado. Solo icono, sin texto.',
};

export const JBUTTON_ICON_POSITIONS: Record<JButtonIconPosition, string> = {
  left: 'Icono antes del texto (default). flex-direction: row.',
  right: 'Icono despues del texto. flex-direction: row-reverse.',
  top: 'Icono sobre el texto. flex-direction: column.',
  bottom: 'Icono bajo el texto. flex-direction: column-reverse.',
};

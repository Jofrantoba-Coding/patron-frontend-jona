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
  /** Marca el boton como solo-icono (sin texto) para el espaciado cuadrado. */
  iconOnly?: boolean;
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

export const JBUTTON_VARIANT_CLASSES: Record<JButtonVariant, string> = {
  default: 'bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-500',
  outline:
    'border border-neutral-300 bg-transparent text-neutral-900 hover:bg-neutral-100 focus-visible:ring-neutral-400',
  ghost: 'bg-transparent text-neutral-700 hover:bg-neutral-100 focus-visible:ring-neutral-400',
  destructive: 'bg-danger-500 text-white hover:bg-danger-600 focus-visible:ring-danger-500',
  secondary:
    'bg-neutral-200 text-neutral-700 hover:bg-neutral-300 focus-visible:ring-neutral-400',
  link: 'bg-transparent text-primary-600 underline-offset-4 hover:underline p-0 h-auto focus-visible:ring-primary-500',
  accent: 'bg-accent-600 text-white hover:bg-accent-700 focus-visible:ring-accent-500',
};

export const JBUTTON_ICON_POSITION_CLASSES: Record<JButtonIconPosition, string> = {
  left: 'flex-row',
  right: 'flex-row-reverse',
  top: 'flex-col',
  bottom: 'flex-col-reverse',
};

export const JBUTTON_SIZE_CLASSES: Record<JButtonSize, string> = {
  xs: 'min-h-6 px-2 py-0.5 text-xs rounded',
  sm: 'min-h-7 px-3 py-1 text-xs rounded-md',
  md: 'min-h-9 px-4 py-2 text-sm rounded-md',
  default: 'min-h-9 px-4 py-2 text-sm rounded-md',
  lg: 'min-h-11 px-6 py-2 text-base rounded-md',
  xl: 'min-h-14 px-8 py-3 text-lg rounded-lg',
  icon: 'h-9 w-9 p-0 rounded-md',
};

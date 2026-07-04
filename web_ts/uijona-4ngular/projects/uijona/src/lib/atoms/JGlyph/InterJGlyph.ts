export type JGlyphSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type JGlyphTone =
  | 'current'
  | 'primary'
  | 'accent'
  | 'neutral'
  | 'muted'
  | 'success'
  | 'warning'
  | 'danger';

/** Contrato publico de JGlyph. El contenido SVG (<path>, <circle>, ...) se proyecta. */
export interface InterJGlyph {
  size?: JGlyphSize | number;
  tone?: JGlyphTone;
  viewBox?: string;
  strokeWidth?: number;
  /** Usa fill=currentColor en vez de stroke (iconos solidos). */
  filled?: boolean;
  /** Si se define, el icono es anunciable (role=img); si no, aria-hidden. */
  ariaLabel?: string;
}

export const JGLYPH_DEFAULTS = {
  size: 'md',
  tone: 'current',
  viewBox: '0 0 24 24',
  strokeWidth: 2,
  filled: false,
} as const satisfies Pick<InterJGlyph, 'size' | 'tone' | 'viewBox' | 'strokeWidth' | 'filled'>;

export const JGLYPH_SIZE_CLASSES: Record<JGlyphSize, string> = {
  xs: 'h-3.5 w-3.5',
  sm: 'h-4 w-4',
  md: 'h-[1.125rem] w-[1.125rem]',
  lg: 'h-5 w-5',
  xl: 'h-6 w-6',
};

export const JGLYPH_TONE_CLASSES: Record<JGlyphTone, string> = {
  current: '',
  primary: 'text-primary-600',
  accent: 'text-accent-600',
  neutral: 'text-neutral-700',
  muted: 'text-neutral-400',
  success: 'text-success-600',
  warning: 'text-warning-600',
  danger: 'text-danger-600',
};

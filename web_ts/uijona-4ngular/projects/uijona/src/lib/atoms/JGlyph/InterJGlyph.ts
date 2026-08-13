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


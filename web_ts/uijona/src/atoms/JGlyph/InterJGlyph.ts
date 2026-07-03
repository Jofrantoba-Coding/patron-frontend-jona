import React from 'react';

export type JGlyphSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type JGlyphTone =
  | 'current' | 'primary' | 'accent' | 'neutral' | 'muted'
  | 'success' | 'warning' | 'danger';

export interface InterJGlyph {
  /** Contenido SVG: <path>, <polyline>, <circle>, etc. */
  children: React.ReactNode;
  /** Tamaño con nombre o px exactos. */
  size?: JGlyphSize | number;
  /** Color (por defecto hereda el color de texto del contenedor). */
  tone?: JGlyphTone;
  viewBox?: string;
  strokeWidth?: number;
  /** Usa fill=currentColor en vez de stroke (iconos sólidos). */
  filled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  /** Si se define, el icono es anunciable (role=img); si no, aria-hidden. */
  'aria-label'?: string;
}

export const JGLYPH_DEFAULTS = {
  size: 'md',
  tone: 'current',
  viewBox: '0 0 24 24',
  strokeWidth: 2,
  filled: false,
} as const satisfies Partial<InterJGlyph>;

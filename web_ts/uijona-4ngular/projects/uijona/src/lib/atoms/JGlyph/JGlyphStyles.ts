// JGlyphStyles.ts — JONA View (presentacion)
// Mapas de clases Tailwind del componente. Detalle de implementacion visual:
// se consumen desde el Impl y NO forman parte de la API publica de la libreria,
// para poder rediseniar sin romper a los consumidores.
import type { JGlyphSize, JGlyphTone } from './InterJGlyph';

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

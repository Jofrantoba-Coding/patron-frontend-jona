// Contrato de UI del texto: un átomo. El tono es un rol, no un color.
import type { ReactNode } from 'react';

export interface InterJText {
  children: ReactNode;
  /** Rol del texto: normal, atenuado (ayuda) o peligro (error). */
  tone?: 'default' | 'muted' | 'danger';
  /**
   * Elemento HTML. `h1` y `h2` se conservan por compatibilidad con la versión 1.0: para un título,
   * JHeading, que separa el nivel del tamaño. Dentro del sistema de diseño ya no se usan (regla 5).
   */
  as?: 'p' | 'span' | 'h1' | 'h2';
  id?: string;
  /** `alert` para un error que debe anunciarse en cuanto aparece. */
  role?: 'alert' | 'status';
}

/** Solo configuración de presentación. */
export const JTEXT_DEFAULTS = {
  tone: 'default',
  as: 'p',
} as const satisfies Required<Pick<InterJText, 'tone' | 'as'>>;

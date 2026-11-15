// Contrato de UI del texto: un átomo. El tono es un rol, no un color.
import type { ReactNode } from 'react';

export interface InterJText {
  children: ReactNode;
  /** Rol del texto: normal, atenuado (ayuda) o peligro (error). */
  tone?: 'default' | 'muted' | 'danger';
  /** Elemento HTML: el nivel de título lo decide quien compone, no el átomo. */
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

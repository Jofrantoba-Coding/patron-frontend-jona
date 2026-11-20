// Contrato de UI del título: un átomo. El nivel es semántica (dónde está en el esquema del
// documento); el tamaño es estilo (cómo se ve). Van separados para que ninguno arrastre al otro.
import type { ReactNode } from 'react';

export interface InterJHeading {
  children: ReactNode;
  /**
   * Nivel en el esquema del documento: dibuja <h1>…<h6>. Obligatorio: el átomo no sabe en qué
   * lugar de la página está, lo sabe quien compone. Un nivel nunca se salta hacia abajo.
   */
  level: 1 | 2 | 3 | 4 | 5 | 6;
  /** Tamaño visual. Sin él, el que corresponde al nivel: xl para 1, lg para 2, md para 3, sm de 4 a 6. */
  size?: 'xl' | 'lg' | 'md' | 'sm';
  id?: string;
}

/** Sin configuración propia: el tamaño por defecto depende del nivel, y lo resuelve la Vista. */
export const JHEADING_DEFAULTS = {} as const satisfies Partial<InterJHeading>;

// Contrato de UI de la disposición de página: la «plantilla» de Atomic Design (este libro
// reserva «Plantilla» para la forma clásica de JONA). Recibe huecos, no datos.
import type { ReactNode } from 'react';

export interface InterJPageLayout {
  /** Título de la página: el único <h1>, dentro del <header>. */
  title: string;
  /** Hueco de acciones de la página, junto al título. */
  actions?: ReactNode;
  /**
   * Hueco del contenido principal, dentro del <main>. Sus títulos empiezan en el nivel 2
   * (JHeading level={2}): el 1 es el de la disposición, y los niveles no se saltan.
   */
  children: ReactNode;
}

/** La disposición no tiene configuración de presentación propia: los DEFAULTS están vacíos a propósito. */
export const JPAGELAYOUT_DEFAULTS = {} as const satisfies Partial<InterJPageLayout>;

// Contrato de UI de la disposición de página: la «plantilla» de Atomic Design (este libro
// reserva «Plantilla» para la forma clásica de JONA). Recibe huecos, no datos.
import type { ReactNode } from 'react';

export interface InterJPageLayout {
  /** Título de la página: el único <h1>. */
  title: string;
  /** Hueco de acciones de la página, junto al título. */
  actions?: ReactNode;
  /** Hueco del contenido principal. */
  children: ReactNode;
}

/** La disposición no tiene configuración de presentación propia: los DEFAULTS están vacíos a propósito. */
export const JPAGELAYOUT_DEFAULTS = {} as const satisfies Partial<InterJPageLayout>;

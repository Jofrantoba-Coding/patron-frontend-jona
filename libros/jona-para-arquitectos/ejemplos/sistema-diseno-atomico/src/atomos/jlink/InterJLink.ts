// Contrato de UI del enlace: un átomo. Navegar es seguir un href: el contrato no tiene onClick,
// así que no hay forma de escribir un enlace que el teclado no enfoque o un rastreador no siga.
import type { ReactNode } from 'react';

/**
 * Un destino real: una ruta del sitio o una URL completa. Con un tipo de plantilla, "#" y
 * "javascript:" no compilan, y una ruta armada con una plantilla (`/productos/${sku}`) sí.
 */
export type JLinkHref = `/${string}` | `https://${string}` | `http://${string}` | `mailto:${string}` | `tel:${string}`;

export interface InterJLink {
  /** Texto visible: es el nombre accesible, y el texto del enlace para un rastreador. */
  children: ReactNode;
  href: JLinkHref;
  /** `page` en el enlace a la página en la que se está. */
  'aria-current'?: 'page';
  /** Nombre accesible más preciso que el texto: «Ver Teclado mecánico» para un «Ver». */
  'aria-label'?: string;
  /** Relación con el destino, por ejemplo `external` o `nofollow`. */
  rel?: string;
}

/** Sin configuración de presentación propia: los DEFAULTS están vacíos a propósito. */
export const JLINK_DEFAULTS = {} as const satisfies Partial<InterJLink>;

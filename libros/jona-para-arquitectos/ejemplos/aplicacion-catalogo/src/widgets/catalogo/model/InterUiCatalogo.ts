// Contrato de UI del widget de catálogo: dispone dos huecos. Quién los llena (las entradas de
// dos funcionalidades) lo decide la entrada; la vista solo sabe dónde va cada uno.
import type { ReactNode } from 'react';

export interface InterUiCatalogo {
  lista: ReactNode;
  dialogo: ReactNode;
}

/** El widget no tiene configuración de presentación propia. */
export const UICATALOGO_DEFAULTS = {} as const satisfies Partial<InterUiCatalogo>;

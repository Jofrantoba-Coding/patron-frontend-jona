// Contrato de UI de la imagen: un átomo. Tres decisiones que no se dejan al consumidor:
// el texto alternativo (o la decisión explícita de que no lo tiene), las dimensiones (el espacio
// se reserva antes de que la imagen llegue, y la página no salta), y cuándo se carga.

interface JImageBase {
  src: string;
  /** Ancho intrínseco en píxeles. Con el alto, fija la proporción del espacio reservado. */
  width: number;
  height: number;
  /**
   * La imagen principal de la página, la que se ve sin desplazarse: carga de inmediato y con
   * prioridad alta. Sin prioridad, la imagen carga en diferido. Una o ninguna por página.
   */
  prioridad?: boolean;
}

/** Una imagen que informa: su texto alternativo es obligatorio. */
export interface JImageInformativa extends JImageBase {
  alt: string;
  decorativa?: false;
}

/** Una imagen que no informa: el alt vacío es una decisión, no un olvido. */
export interface JImageDecorativa extends JImageBase {
  decorativa: true;
  alt?: never;
}

export type InterJImage = JImageInformativa | JImageDecorativa;

/** Solo configuración de presentación. */
export const JIMAGE_DEFAULTS = {
  prioridad: false,
} as const satisfies Required<Pick<JImageBase, 'prioridad'>>;

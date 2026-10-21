import type { RespuestaRow } from '../../core/models';

/** Contrato de la página de respuestas del banco (listado + evidencia + navegación a la planilla). */
export interface RespuestasPageContract {
  rows: RespuestaRow[];
  page: number;
  pageSize: number;
  total: number;
  cargando: boolean;
  errorCarga: string | null;
  detalleSeleccionado: RespuestaRow | null;
  detalleCargando: boolean;
  detalleError: string | null;
}

/**
 * Qué significa cada tipo de respuesta del banco.
 *
 * <p>Los códigos por sí solos no dicen nada: VAL suena a «validada» y en
 * realidad es un rechazo por estructura. Traducirlos evita que alguien celebre
 * un archivo rechazado.</p>
 */
export interface SignificadoRespuesta {
  titulo: string;
  detalle: string;
  tono: 'success' | 'danger' | 'warning' | 'neutral';
}

export const SIGNIFICADO_RESPUESTA: Record<string, SignificadoRespuesta> = {
  RES: {
    titulo: 'Aceptada',
    detalle: 'Estructura correcta; el archivo entró a procesar.',
    tono: 'success',
  },
  VAL: {
    titulo: 'Rechazada',
    detalle: 'Error de estructura: el banco no procesó el archivo.',
    tono: 'danger',
  },
  RES2: {
    titulo: 'Resultado final',
    detalle: 'Desenlace de las interbancarias, incluidas las devoluciones.',
    tono: 'neutral',
  },
  PAR: {
    titulo: 'Procesamiento parcial',
    detalle: 'Se procesaron las líneas válidas; el resto viene con error.',
    tono: 'warning',
  },
};

export const TIPOS_RESPUESTA: readonly string[] = Object.keys(SIGNIFICADO_RESPUESTA);

export const significadoRespuesta = (codigo: string | null | undefined): SignificadoRespuesta =>
  SIGNIFICADO_RESPUESTA[String(codigo ?? '').toUpperCase()] ?? {
    titulo: String(codigo ?? '—'),
    detalle: 'Tipo de respuesta no catalogado.',
    tono: 'neutral',
  };

/** Extrae el contenido textual real que devuelve respuestas/detalle, sin interpretarlo. */
export const contenidoRespuestaDetalle = (detalle: Record<string, unknown> | null): string => {
  if (!detalle) return '';
  const valor = (clave: string): unknown => detalle[clave] ?? detalle[clave.toLowerCase()];
  const txt = valor('contenidoTxt');
  if (typeof txt === 'string' && txt.length > 0) return txt;
  const xml = valor('contenidoXml');
  return typeof xml === 'string' ? xml : '';
};
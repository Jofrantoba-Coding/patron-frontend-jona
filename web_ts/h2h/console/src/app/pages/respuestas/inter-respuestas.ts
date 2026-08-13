import type { RespuestaRow } from '../../core/models';

/** Contrato de la página de respuestas del banco (listado + navegación a la planilla). */
export interface RespuestasPageContract {
  rows: RespuestaRow[];
  page: number;
  pageSize: number;
  total: number;
  cargando: boolean;
}

/**
 * Qué significa cada tipo de respuesta del banco.
 *
 * <p>Los códigos por sí solos no dicen nada: `VAL` suena a «validada» y en
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

/**
 * Tipos de respuesta que ofrece el filtro.
 *
 * <p>Se deriva del catálogo de significados en vez de repetir la lista: si mañana el banco
 * añade un código, aparece en el desplegable el mismo día que se documenta qué quiere decir,
 * y no queda un filtro que esconde filas que sí existen.</p>
 */
export const TIPOS_RESPUESTA: readonly string[] = Object.keys(SIGNIFICADO_RESPUESTA);

export const significadoRespuesta = (codigo: string | null | undefined): SignificadoRespuesta =>
  SIGNIFICADO_RESPUESTA[String(codigo ?? '').toUpperCase()] ?? {
    titulo: String(codigo ?? '—'),
    detalle: 'Tipo de respuesta no catalogado.',
    tono: 'neutral',
  };

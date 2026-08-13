import type { PlanillaDetalleFull, PlanillaFiltro, PlanillaRow } from '../../core/models';

/** Contrato de la página de consulta de planillas (listado + filtros + detalle con etapas). */
export interface PlanillasPageContract {
  rows: PlanillaRow[];
  page: number;
  pageSize: number;
  total: number;
  filtros: PlanillaFiltro;
  detalle: PlanillaDetalleFull | null;
  detalleLoading: string | null;
}

/** Qué le toca a una planilla según su estado. */
export interface SiguientePaso {
  /** Verbo en imperativo: lo que hará el operador, no el nombre del estado destino. */
  accion: string;
  /** Estado destino de la transición, el que espera `onEtapa`. */
  destino: string | null;
  /** `atencion` = el reloj corre en contra; `espera` = depende del banco. */
  tono: 'accion' | 'espera' | 'atencion' | 'cerrado';
  /** Por qué está esperando, cuando no hay nada que hacer. */
  nota?: string;
}

/**
 * Traducción de estado a siguiente paso.
 *
 * <p>Es la misma máquina de estados que ya usa el stepper del detalle, pero
 * expuesta en el listado: una bandeja de trabajo tiene que decir qué hacer sin
 * obligar a abrir cada fila. El operador escanea la columna y sabe dónde está
 * su trabajo del día.</p>
 *
 * <p>Los estados de espera se distinguen de los accionables a propósito:
 * `ENVIADA` no es un pendiente del operador sino del banco, y mezclarlos haría
 * que la bandeja pareciera más cargada de lo que está.</p>
 */
export const SIGUIENTE_PASO: Record<string, SiguientePaso> = {
  GENERADA: { accion: 'Validar', destino: 'VALIDADA', tono: 'accion' },
  VALIDADA: { accion: 'Cifrar', destino: 'CIFRADA', tono: 'accion' },
  PENDIENTE_CIFRADO: { accion: 'Cifrar', destino: 'CIFRADA', tono: 'atencion' },
  CIFRADA: { accion: 'Enviar', destino: 'ENVIADA', tono: 'accion' },
  PENDIENTE_ENVIO: { accion: 'Enviar', destino: 'ENVIADA', tono: 'atencion' },
  ENVIADA: {
    accion: 'Esperando al banco',
    destino: 'RESPUESTA_RECIBIDA',
    tono: 'espera',
    nota: 'La respuesta llega al buzón; se puede forzar la lectura.',
  },
  RESPUESTA_RECIBIDA: {
    accion: 'Decidir',
    destino: 'PROCESADA',
    tono: 'atencion',
    nota: 'La respuesta caduca en el buzón del banco: decide hoy.',
  },
  PROCESADA: { accion: 'Cerrada', destino: null, tono: 'cerrado' },
  PROCESADA_PARCIAL: { accion: 'Cerrada con rechazos', destino: null, tono: 'atencion' },
  RECHAZADA: { accion: 'Rechazada', destino: null, tono: 'atencion' },
  ANULADA: { accion: 'Anulada', destino: null, tono: 'cerrado' },
  ERROR: { accion: 'Revisar error', destino: null, tono: 'atencion' },
  ERROR_CIFRADO: { accion: 'Revisar cifrado', destino: null, tono: 'atencion' },
};

export const siguientePaso = (estado: string | null | undefined): SiguientePaso =>
  SIGUIENTE_PASO[String(estado ?? '')] ?? { accion: '—', destino: null, tono: 'cerrado' };

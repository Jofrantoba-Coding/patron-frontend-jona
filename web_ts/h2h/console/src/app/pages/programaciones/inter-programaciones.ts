import type { ProgramacionDetalleFull, ProgramacionFiltro, ProgramacionRow } from '../../core/models';

/**
 * Siguiente paso de un plan de envío, para leerlo desde el listado.
 *
 * <p>Mismo criterio que en Planillas: la bandeja dice qué HACER, no cómo se
 * llama el estado. Y separa lo que espera al operador de lo que espera al
 * banco, para que la lista no parezca más cargada de lo que está.</p>
 */
export const SIGUIENTE_PASO_PROGRAMACION: Record<string, string> = {
  ABIERTA: 'Añadir operaciones o generar',
  PROGRAMADA: 'Generar planilla',
  GENERADA: 'Planilla creada · seguir en Planillas',
  ENVIADA: 'Esperando al banco',
  RESPONDIDA: 'Cerrada',
  ERROR: 'Revisar error',
  CANCELADA: 'Cancelada',
};

export const siguientePasoProgramacion = (estado: string | null | undefined): string =>
  SIGUIENTE_PASO_PROGRAMACION[String(estado ?? '')] ?? '—';

/** Contrato de la página de programación de envíos (listado + filtros + detalle + acciones). */
export interface ProgramacionesPageContract {
  rows: ProgramacionRow[];
  page: number;
  pageSize: number;
  total: number;
  filtros: ProgramacionFiltro;
  detalle: ProgramacionDetalleFull | null;
  detalleLoading: string | null;
}

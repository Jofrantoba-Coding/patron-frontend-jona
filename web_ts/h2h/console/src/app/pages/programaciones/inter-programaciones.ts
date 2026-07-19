import type { ProgramacionDetalleFull, ProgramacionFiltro, ProgramacionRow } from '../../core/models';

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

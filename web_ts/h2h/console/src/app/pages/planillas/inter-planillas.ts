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

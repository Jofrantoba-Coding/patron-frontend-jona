import type { Correlativo } from '../../core/models';

/** Contrato de la pagina de correlativos (mantenimiento CRUD). */
export interface CorrelativosPageContract {
  rows: Correlativo[];
  load(): void;
  guardar(): void;
  eliminar(): void;
}

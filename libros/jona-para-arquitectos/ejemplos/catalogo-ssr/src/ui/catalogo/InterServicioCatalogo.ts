// Contrato de servicio del cliente: lo que la Implementación del cliente pide al servidor SSR,
// que hace de BFF de esta pantalla. Lo implementa cliente/crearServicioCatalogoFetch.ts.
import type { DatosUiCatalogo } from './InterUiCatalogo';

export type ResultadoEliminar = 'eliminado' | 'no-encontrado';

export interface InterServicioCatalogo {
  /** La cara de datos para ese término, calculada en el servidor por la misma Implementación que la página. */
  consultar(termino: string): Promise<DatosUiCatalogo>;
  /** `no-encontrado` si ya no existía; rechaza si no se pudo. */
  eliminar(id: string): Promise<ResultadoEliminar>;
}

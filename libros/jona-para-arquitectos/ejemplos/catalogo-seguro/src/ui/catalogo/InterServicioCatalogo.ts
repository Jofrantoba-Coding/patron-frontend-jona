// Contrato de servicio del catálogo. `prohibido` es un resultado esperado, no un error: el
// servidor puede negar lo que la pantalla ofreció, porque la decisión es suya.
import type { Producto } from '../../dominio/Producto';

export type ResultadoEliminar = 'eliminado' | 'no-encontrado' | 'prohibido';

export interface InterServicioCatalogo {
  listar(): Promise<Producto[]>;
  eliminar(id: string): Promise<ResultadoEliminar>;
}

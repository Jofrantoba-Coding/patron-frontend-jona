// Contrato de UI de la lista de productos (modelo de vista).
import type { Producto } from '../../../entities/producto';

export interface InterUiListaProductos {
  productos: readonly Producto[];
  cargando: boolean;
  error?: string;
  textoVacio: string;
  onBuscar: (termino: string) => void;
  onEditar: (id: string) => void;
  onEliminar: (producto: Producto) => void;
}

/** Solo textos; la lista es estado. */
export const UILISTAPRODUCTOS_DEFAULTS = {
  textoVacio: 'No hay productos que coincidan',
} as const satisfies Pick<InterUiListaProductos, 'textoVacio'>;

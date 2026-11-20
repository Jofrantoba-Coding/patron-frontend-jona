// Contrato de servicio del cliente para la búsqueda. Solo lo usa el sitio estático: allí no hay
// servidor que resuelva /buscar?q=, y la búsqueda se hace en el navegador sobre el índice JSON.
import type { FilaProductoUi } from './InterUiCatalogo';

export interface InterServicioBusqueda {
  buscar(termino: string): Promise<readonly FilaProductoUi[]>;
}

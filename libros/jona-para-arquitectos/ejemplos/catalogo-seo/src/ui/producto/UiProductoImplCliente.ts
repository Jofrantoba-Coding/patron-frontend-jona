import { useState } from 'react';
import type { DatosUiProducto, EventosUiProducto, InteraccionUiProducto } from './InterUiProducto';

/**
 * Implementación del cliente: el carrito de esta visita. Empieza en cero en los dos lados, así
 * que el servidor y la hidratación dibujan lo mismo. En el servidor no hay eventos: agregar no
 * hace nada hasta que el navegador hidrata.
 */
export function useUiProductoImplCliente(datos: DatosUiProducto): DatosUiProducto & InteraccionUiProducto & EventosUiProducto {
  const [enCarrito, setEnCarrito] = useState(0);
  return {
    ...datos,
    enCarrito,
    onAgregar: () => setEnCarrito((n) => (n < datos.stock ? n + 1 : n)),
  };
}

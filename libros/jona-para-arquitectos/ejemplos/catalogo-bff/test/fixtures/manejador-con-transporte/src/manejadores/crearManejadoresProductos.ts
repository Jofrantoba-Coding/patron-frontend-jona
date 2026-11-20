// Violación de la regla 1: el manejador lee la petición HTTP él mismo. Queda atado al transporte
// y ya no se puede probar con los falsos.
import type { IncomingMessage } from 'node:http';
import type { InterCatalogo } from '../puertos/InterCatalogo.js';

export function crearManejadoresProductos(catalogo: InterCatalogo) {
  return {
    async listar(peticion: IncomingMessage) {
      const termino = new URL(peticion.url ?? '/', 'http://localhost').searchParams.get('q') ?? '';
      return catalogo.buscar(termino);
    },
  };
}

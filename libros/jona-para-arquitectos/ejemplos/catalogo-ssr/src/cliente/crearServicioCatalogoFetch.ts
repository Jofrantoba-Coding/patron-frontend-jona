// Adaptador del cliente: el contrato de servicio de la pantalla sobre las rutas JSON del propio
// servidor SSR. Mismo origen: el navegador nunca ve la URL de la API de productos.
import type { DatosUiCatalogo, InterServicioCatalogo } from '../ui/catalogo';

export interface OpcionesServicioCatalogo {
  /** Por defecto, el mismo origen que sirvió la página. */
  baseUrl?: string;
  fetch?: typeof fetch;
}

export function crearServicioCatalogoFetch({ baseUrl = '', fetch: pedir = fetch }: OpcionesServicioCatalogo = {}): InterServicioCatalogo {
  return {
    async consultar(termino) {
      const respuesta = await pedir(`${baseUrl}/api/catalogo?q=${encodeURIComponent(termino)}`, { headers: { Accept: 'application/json' } });
      if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
      return (await respuesta.json()) as DatosUiCatalogo;
    },
    async eliminar(id) {
      const respuesta = await pedir(`${baseUrl}/api/productos/${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (respuesta.status === 204) return 'eliminado';
      if (respuesta.status === 404) return 'no-encontrado';
      throw new Error(`HTTP ${respuesta.status}`);
    },
  };
}

// Violación de la regla 3: el BFF decide si el SKU ya existe antes de pedirle a catalogo que cree.
// Es la regla de catalogo repetida (y con carrera: otro alta puede entrar entre la consulta y la
// creación). El BFF solo traduce el conflicto que catalogo responde.
import { ErrorBackend } from '../puertos/ErrorBackend.js';
import type { DatosArticulo, InterCatalogo } from '../puertos/InterCatalogo.js';

export function crearManejadoresProductos(catalogo: InterCatalogo) {
  return {
    async crear(datos: DatosArticulo) {
      const existentes = await catalogo.buscar(datos.sku);
      if (existentes.some((a) => a.sku === datos.sku)) throw new ErrorBackend('conflicto', 'El SKU ya existe');
      return catalogo.crear(datos);
    },
  };
}

// Falso de catalogo: un adaptador en memoria del puerto, para las pruebas de los manejadores.
// Simula la regla de unicidad porque simula al backend que la tiene; vive en test/, fuera del
// código del BFF, y pasa la misma suite de contrato que el adaptador HTTP.
import { ErrorBackend } from '../../src/puertos/ErrorBackend.js';
import type { Articulo, DatosArticulo, InterCatalogo } from '../../src/puertos/InterCatalogo.js';

export function crearCatalogoFalso(semilla: readonly Articulo[] = []): InterCatalogo {
  const articulos = new Map(semilla.map((a) => [a.codigoArticulo, { ...a }]));
  let siguiente = semilla.length + 1;

  const skuOcupado = (sku: string, salvo?: string) => [...articulos.values()].some((a) => a.sku === sku && a.codigoArticulo !== salvo);
  const existente = (codigo: string) => {
    const articulo = articulos.get(codigo);
    if (!articulo) throw new ErrorBackend('no-encontrado', `No existe el artículo ${codigo}`);
    return articulo;
  };
  const copia = ({ codigoArticulo, sku, titulo, precioCentimos }: Articulo): Articulo => ({ codigoArticulo, sku, titulo, precioCentimos });

  return {
    async buscar(texto) {
      const t = texto.toLowerCase();
      return [...articulos.values()]
        .filter((a) => a.titulo.toLowerCase().includes(t) || a.sku.toLowerCase().includes(t))
        .sort((a, b) => a.sku.localeCompare(b.sku))
        .map(copia);
    },
    async obtener(codigo) {
      const articulo = articulos.get(codigo);
      return articulo && copia(articulo);
    },
    async crear(datos: DatosArticulo) {
      if (skuOcupado(datos.sku)) throw new ErrorBackend('conflicto', `El SKU ${datos.sku} ya está registrado`);
      const articulo = copia({ ...datos, codigoArticulo: `ART-${String(siguiente++).padStart(4, '0')}` });
      articulos.set(articulo.codigoArticulo, articulo);
      return copia(articulo);
    },
    async actualizar(codigo, datos) {
      existente(codigo);
      if (skuOcupado(datos.sku, codigo)) throw new ErrorBackend('conflicto', `El SKU ${datos.sku} ya está registrado`);
      const articulo = copia({ ...datos, codigoArticulo: codigo });
      articulos.set(codigo, articulo);
      return copia(articulo);
    },
    async eliminar(codigo) {
      existente(codigo);
      articulos.delete(codigo);
    },
  };
}

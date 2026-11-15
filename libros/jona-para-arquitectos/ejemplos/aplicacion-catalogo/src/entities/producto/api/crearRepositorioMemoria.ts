// Adaptador en memoria del puerto: para desarrollar sin backend y para las pruebas.
import { ErrorRepositorio } from '../../../shared/api';
import type { InterProductoRepositorio } from '../model/InterProductoRepositorio';
import { coincide, type DatosProducto, type Producto } from '../model/Producto';

export function crearRepositorioMemoria(semilla: readonly Producto[] = []): InterProductoRepositorio {
  const productos = new Map(semilla.map((p) => [p.id, { ...p }]));
  let siguiente = semilla.length + 1;

  const skuOcupado = (sku: string, salvo?: string) => [...productos.values()].some((p) => p.sku === sku && p.id !== salvo);
  const existente = (id: string) => {
    const producto = productos.get(id);
    if (!producto) throw new ErrorRepositorio('no-encontrado', `No existe el producto ${id}`);
    return producto;
  };

  return {
    async listar(termino = '') {
      return [...productos.values()]
        .filter((p) => coincide(p, termino))
        .sort((a, b) => a.sku.localeCompare(b.sku))
        .map((p) => ({ ...p }));
    },
    async obtener(id) {
      const producto = productos.get(id);
      return producto && { ...producto };
    },
    async crear(datos: DatosProducto) {
      if (skuOcupado(datos.sku)) throw new ErrorRepositorio('conflicto', `El SKU ${datos.sku} ya existe`);
      const producto = { ...datos, id: `p-${siguiente++}` };
      productos.set(producto.id, producto);
      return { ...producto };
    },
    async actualizar(id, datos) {
      existente(id);
      if (skuOcupado(datos.sku, id)) throw new ErrorRepositorio('conflicto', `El SKU ${datos.sku} ya existe`);
      const producto = { ...datos, id };
      productos.set(id, producto);
      return { ...producto };
    },
    async eliminar(id) {
      existente(id);
      productos.delete(id);
    },
  };
}

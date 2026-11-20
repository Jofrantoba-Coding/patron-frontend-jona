// Adaptador en memoria del puerto de lectura. Devuelve copias: quien las modifique no cambia lo guardado.
import { coincide } from '../../compartido/busqueda';
import type { Producto } from '../../dominio/Producto';
import type { InterProductoRepositorio } from '../InterProductoRepositorio';

export function crearRepositorioMemoria(iniciales: readonly Producto[]): InterProductoRepositorio {
  const productos = iniciales.map((p) => structuredClone(p)).sort((a, b) => a.sku.localeCompare(b.sku));
  return {
    listar: async (termino) =>
      productos.filter((p) => termino === undefined || coincide(termino, p)).map((p) => structuredClone(p)),
    obtenerPorSku: async (sku) => {
      const producto = productos.find((p) => p.sku === sku);
      return producto && structuredClone(producto);
    },
  };
}

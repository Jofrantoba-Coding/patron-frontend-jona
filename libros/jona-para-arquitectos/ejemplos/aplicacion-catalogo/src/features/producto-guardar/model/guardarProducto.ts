// Caso de uso (capa de aplicación): guardar un producto nuevo o existente. Tiene responsabilidad
// propia, y por eso existe: valida con el dominio, elige entre crear y actualizar, y traduce el
// conflicto del repositorio a un error del campo SKU. Sin React: se prueba con el adaptador en memoria.
import { validarProducto, type BorradorProducto, type ErroresProducto, type InterProductoRepositorio, type Producto } from '../../../entities/producto';
import { ErrorRepositorio } from '../../../shared/api';

export type ResultadoGuardar = { ok: true; producto: Producto } | { ok: false; errores: ErroresProducto };

export async function guardarProducto(
  repositorio: InterProductoRepositorio,
  borrador: BorradorProducto,
  id?: string,
): Promise<ResultadoGuardar> {
  const validacion = validarProducto(borrador);
  if (!validacion.ok) return validacion;
  try {
    const producto = id === undefined
      ? await repositorio.crear(validacion.datos)
      : await repositorio.actualizar(id, validacion.datos);
    return { ok: true, producto };
  } catch (error) {
    // La unicidad del SKU la garantiza el repositorio (el backend); aquí solo se traduce.
    if (error instanceof ErrorRepositorio && error.tipo === 'conflicto') {
      return { ok: false, errores: { sku: 'Ya existe un producto con ese SKU' } };
    }
    throw error;
  }
}

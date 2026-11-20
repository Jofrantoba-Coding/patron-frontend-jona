// Implementación del servidor: funciones, no un hook. Corre una vez por petición, carga por el
// puerto y llena la cara de datos del contrato. No tiene estado ni eventos, y no la ve el
// navegador (regla 1 de test/architecture): el sufijo Servidor la marca como código del servidor.
import type { Producto } from '../../dominio/Producto';
import { ErrorRepositorio } from '../../servidor/ErrorRepositorio';
import type { InterProductoRepositorio } from '../../servidor/InterProductoRepositorio';
import type { ResultadoEliminar } from './InterServicioCatalogo';
import type { DatosUiCatalogo, FilaProductoUi } from './InterUiCatalogo';

/** Lo que importa de la petición HTTP para esta pantalla. */
export interface PeticionUiCatalogo {
  termino?: string;
}

/** El formato se decide aquí, una sola vez: el cliente recibe el texto y no vuelve a formatear. */
const aFila = (producto: Producto): FilaProductoUi => ({
  id: producto.id,
  sku: producto.sku,
  nombre: producto.nombre,
  precio: `S/ ${producto.precio.toFixed(2)}`,
  stock: producto.stock,
});

export async function cargarUiCatalogo(repositorio: InterProductoRepositorio, peticion: PeticionUiCatalogo): Promise<DatosUiCatalogo> {
  const termino = (peticion.termino ?? '').trim();
  try {
    return { termino, productos: (await repositorio.listar(termino)).map(aFila) };
  } catch {
    return { termino, productos: [], aviso: 'No se pudo cargar el catálogo' };
  }
}

/** Borrar algo que ya no existe no es un error para esta pantalla: se informa como no-encontrado. */
export async function eliminarProducto(repositorio: InterProductoRepositorio, id: string): Promise<ResultadoEliminar> {
  try {
    await repositorio.eliminar(id);
    return 'eliminado';
  } catch (error) {
    if (error instanceof ErrorRepositorio && error.tipo === 'no-encontrado') return 'no-encontrado';
    throw error;
  }
}

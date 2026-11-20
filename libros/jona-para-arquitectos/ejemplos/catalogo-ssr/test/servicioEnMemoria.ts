// Servicio del cliente para las pruebas de pantalla: la Implementación del servidor sobre el
// adaptador en memoria, sin HTTP de por medio. Las pruebas son raíces de composición propias:
// pueden juntar lo del servidor y lo del cliente.
import type { Producto } from '../src/dominio/Producto';
import { crearRepositorioMemoria } from '../src/servidor/adaptadores/crearRepositorioMemoria';
import type { InterProductoRepositorio } from '../src/servidor/InterProductoRepositorio';
import type { InterServicioCatalogo } from '../src/ui/catalogo';
import { cargarUiCatalogo, eliminarProducto } from '../src/ui/catalogo/indexServidor';

export function crearServicioEnMemoria(productos: readonly Producto[]): { servicio: InterServicioCatalogo; repositorio: InterProductoRepositorio } {
  const repositorio = crearRepositorioMemoria(productos);
  return {
    repositorio,
    servicio: {
      consultar: (termino) => cargarUiCatalogo(repositorio, { termino }),
      eliminar: (id) => eliminarProducto(repositorio, id),
    },
  };
}

// Adaptador del cliente para la búsqueda: descarga el índice JSON (lo publican los dos modos) y
// filtra con la misma definición de coincidencia que el repositorio del servidor.
import { coincide } from '../compartido/busqueda';
import { RUTA_INDICE_BUSQUEDA } from '../compartido/rutas';
import type { FilaProductoUi, InterServicioBusqueda } from '../ui';

export function crearServicioBusquedaFetch(base = ''): InterServicioBusqueda {
  let indice: Promise<FilaProductoUi[]> | undefined;
  const cargar = () =>
    (indice ??= fetch(`${base}${RUTA_INDICE_BUSQUEDA}`).then((r) => {
      if (!r.ok) throw new Error(`Índice de búsqueda: HTTP ${r.status}`);
      return r.json() as Promise<FilaProductoUi[]>;
    }));
  return {
    buscar: async (termino) => (await cargar()).filter((fila) => coincide(termino, fila)),
  };
}

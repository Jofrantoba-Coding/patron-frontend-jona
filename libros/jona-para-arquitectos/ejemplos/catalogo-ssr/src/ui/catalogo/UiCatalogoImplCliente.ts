import { useState } from 'react';
import type { InterServicioCatalogo } from './InterServicioCatalogo';
import type { DatosUiCatalogo, EventosUiCatalogo, FilaProductoUi, InteraccionUiCatalogo } from './InterUiCatalogo';

/**
 * Implementación del cliente: estado de interacción (borrador, pendiente, diálogo, error) y los
 * eventos. No carga al montarse: los datos ya vinieron en el HTML. Cuando necesita datos nuevos
 * se los pide al servidor, que los calcula con la Implementación del servidor; aquí solo se
 * guarda la última respuesta, sin recalcularla.
 *
 * Sin servicio (así se dibuja en el servidor) los eventos no hacen nada: no hay a quién pedirle.
 */
export function useUiCatalogoImplCliente(
  inicial: DatosUiCatalogo,
  servicio?: InterServicioCatalogo,
): DatosUiCatalogo & InteraccionUiCatalogo & EventosUiCatalogo {
  const [datos, setDatos] = useState(inicial);
  const [borrador, setBorrador] = useState(inicial.termino);
  const [pendiente, setPendiente] = useState(false);
  const [aEliminar, setAEliminar] = useState<FilaProductoUi>();
  const [error, setError] = useState<string>();

  async function consultar(termino: string, siFalla: string) {
    try {
      setDatos(await servicio!.consultar(termino));
    } catch {
      setError(siFalla);
    }
  }

  return {
    ...datos,
    borrador,
    pendiente,
    aEliminar,
    error,
    onCambiarBorrador: setBorrador,
    onBuscar: async () => {
      if (!servicio) return;
      setError(undefined);
      setPendiente(true);
      await consultar(borrador.trim(), 'No se pudo buscar. Intente de nuevo.');
      setPendiente(false);
    },
    onPedirEliminar: (fila) => {
      setError(undefined);
      setAEliminar(fila);
    },
    onCancelarEliminar: () => setAEliminar(undefined),
    onConfirmarEliminar: async () => {
      if (!servicio || !aEliminar) return;
      setPendiente(true);
      try {
        // `eliminado` o `no-encontrado`: para la pantalla es lo mismo, el producto ya no está.
        await servicio.eliminar(aEliminar.id);
      } catch {
        setError('No se pudo eliminar. Intente de nuevo.');
        setPendiente(false);
        return;
      }
      setAEliminar(undefined);
      await consultar(datos.termino, 'Se eliminó, pero no se pudo actualizar la lista.');
      setPendiente(false);
    },
  };
}

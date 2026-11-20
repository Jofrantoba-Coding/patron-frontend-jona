import { useEffect, useState } from 'react';
import { aUrlSegura } from '../../compartido/UrlSegura';
import type { Producto } from '../../dominio/Producto';
import type { SesionUsuario } from '../../dominio/SesionUsuario';
import type { InterServicioCatalogo } from './InterServicioCatalogo';
import type { DatosUiCatalogo, EventosUiCatalogo, FilaProductoUi } from './InterUiCatalogo';

/**
 * El paso del dominio al contrato de UI. Aquí se decide qué enlace es seguro: el que no lo es
 * no llega a la fila, y la vista no tiene forma de dibujarlo.
 */
export const aFila = (producto: Producto): FilaProductoUi => ({
  id: producto.id,
  sku: producto.sku,
  nombre: producto.nombre,
  precio: `S/ ${producto.precio.toFixed(2)}`,
  descripcion: producto.descripcion,
  enlace: producto.enlaceFabricante === undefined ? undefined : aUrlSegura(producto.enlaceFabricante),
});

/**
 * Implementación del catálogo. Los permisos los copia de la sesión que respondió el servidor:
 * con ellos la vista decide qué ofrecer. Si el servidor niega una acción, lo informa y no la da
 * por hecha.
 */
export function useUiCatalogoImpl(sesion: SesionUsuario, servicio: InterServicioCatalogo, onSalir: () => void): DatosUiCatalogo & EventosUiCatalogo {
  const [productos, setProductos] = useState<readonly FilaProductoUi[]>([]);
  const [cargando, setCargando] = useState(true);
  const [pendiente, setPendiente] = useState(false);
  const [aEliminar, setAEliminar] = useState<FilaProductoUi>();
  const [error, setError] = useState<DatosUiCatalogo['error']>();

  async function cargar() {
    try {
      setProductos((await servicio.listar()).map(aFila));
    } catch {
      setError('carga');
    } finally {
      setCargando(false);
    }
  }

  // Una carga al montarse; las siguientes, después de cada baja.
  useEffect(() => {
    void cargar();
  }, [servicio]);

  return {
    usuario: sesion.usuario.nombre,
    permisos: sesion.permisos,
    productos,
    cargando,
    pendiente,
    aEliminar,
    error,
    onPedirEliminar: (fila) => {
      setError(undefined);
      setAEliminar(fila);
    },
    onCancelarEliminar: () => setAEliminar(undefined),
    onConfirmarEliminar: async () => {
      if (!aEliminar) return;
      setPendiente(true);
      try {
        const resultado = await servicio.eliminar(aEliminar.id);
        if (resultado === 'prohibido') setError('prohibido');
        else await cargar();
      } catch {
        setError('eliminar');
      } finally {
        setAEliminar(undefined);
        setPendiente(false);
      }
    },
    onSalir,
  };
}

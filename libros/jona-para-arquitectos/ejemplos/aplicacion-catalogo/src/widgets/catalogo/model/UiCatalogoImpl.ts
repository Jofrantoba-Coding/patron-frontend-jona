import { useState } from 'react';
import type { Producto } from '../../../entities/producto';

/**
 * Implementación del widget: coordina dos funcionalidades que, por FSD, no se conocen entre sí.
 * Sabe qué producto se pidió eliminar y avisa a la lista que vuelva a cargar cuando se eliminó.
 */
export function useUiCatalogoImpl() {
  const [productoAEliminar, setProductoAEliminar] = useState<Producto>();
  const [recarga, setRecarga] = useState(0);
  return {
    productoAEliminar,
    recarga,
    onPedirEliminar: setProductoAEliminar,
    onCerrarDialogo: () => setProductoAEliminar(undefined),
    onEliminado: () => {
      setProductoAEliminar(undefined);
      setRecarga((n) => n + 1);
    },
  };
}

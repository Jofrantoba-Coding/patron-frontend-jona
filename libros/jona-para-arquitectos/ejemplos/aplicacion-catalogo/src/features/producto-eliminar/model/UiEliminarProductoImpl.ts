import { useEffect, useState } from 'react';
import type { InterProductoRepositorio, Producto } from '../../../entities/producto';
import { ErrorRepositorio } from '../../../shared/api';
import type { InterUiEliminarProducto } from './InterUiEliminarProducto';

/**
 * Implementación (forma mínima): confirma y elimina. Sin caso de uso: la única decisión propia
 * (que borrar algo que ya no existe cuenta como éxito) cabe aquí, y no la comparte nadie.
 */
export function useUiEliminarProductoImpl(
  repositorio: InterProductoRepositorio,
  producto: Producto | undefined,
  onEliminado: () => void,
): Pick<InterUiEliminarProducto, 'ocupado' | 'error' | 'onConfirmar'> {
  const [ocupado, setOcupado] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => setError(undefined), [producto]);

  return {
    ocupado,
    error,
    onConfirmar: async () => {
      if (!producto) return;
      setOcupado(true);
      try {
        await repositorio.eliminar(producto.id);
        onEliminado();
      } catch (e) {
        if (e instanceof ErrorRepositorio && e.tipo === 'no-encontrado') onEliminado();
        else setError('No se pudo eliminar. Intente de nuevo.');
      } finally {
        setOcupado(false);
      }
    },
  };
}

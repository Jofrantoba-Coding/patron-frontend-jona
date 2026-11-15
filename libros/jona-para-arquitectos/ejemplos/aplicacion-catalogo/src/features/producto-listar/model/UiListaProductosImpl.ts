import { useEffect, useState } from 'react';
import type { InterProductoRepositorio, Producto } from '../../../entities/producto';
import type { InterUiListaProductos } from './InterUiListaProductos';

/**
 * Implementación (forma mínima): carga los productos que coinciden con el término y vuelve a
 * cargarlos cuando cambia `recarga`. Sin caso de uso: listar es una llamada al puerto, y una
 * clase que solo la reenviara no tendría responsabilidad propia.
 */
export function useUiListaProductosImpl(
  repositorio: InterProductoRepositorio,
  recarga: number,
): Pick<InterUiListaProductos, 'productos' | 'cargando' | 'error' | 'onBuscar'> {
  const [termino, setTermino] = useState('');
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    let vigente = true;
    setCargando(true);
    repositorio
      .listar(termino)
      .then((lista) => {
        if (!vigente) return;
        setProductos(lista);
        setError(undefined);
      })
      .catch(() => vigente && setError('No se pudo cargar el catálogo'))
      .finally(() => vigente && setCargando(false));
    return () => {
      vigente = false;
    };
  }, [repositorio, termino, recarga]);

  return { productos, cargando, error, onBuscar: setTermino };
}

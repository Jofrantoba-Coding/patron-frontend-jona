import { useEffect, useState } from 'react';
import type { InterServicioBusqueda } from './InterServicioBusqueda';
import type { DatosUiCatalogo, EventosUiCatalogo, InteraccionUiCatalogo } from './InterUiCatalogo';

/**
 * Implementación del cliente. Con el servidor SSR, la búsqueda llega resuelta en el HTML y aquí
 * solo vive el borrador. En el sitio estático, /buscar es un único archivo prerenderizado sin
 * término: después de hidratar, si la URL trae un término distinto, busca con el servicio.
 * Se hace en un efecto, no al dibujar: el primer dibujo tiene que ser idéntico al del servidor.
 */
export function useUiCatalogoImplCliente(
  inicial: DatosUiCatalogo,
  servicio?: InterServicioBusqueda,
  terminoUrl?: string | null,
): DatosUiCatalogo & InteraccionUiCatalogo & EventosUiCatalogo {
  const [datos, setDatos] = useState(inicial);
  const [borrador, setBorrador] = useState(inicial.termino ?? '');
  const [buscando, setBuscando] = useState(false);

  useEffect(() => {
    const termino = terminoUrl?.trim() ?? '';
    if (inicial.termino === undefined || !servicio || termino === '' || termino === inicial.termino) return;
    let vigente = true;
    setBorrador(termino);
    setBuscando(true);
    servicio
      .buscar(termino)
      .then(
        (productos) => vigente && setDatos({ termino, productos }),
        () => vigente && setDatos({ termino, productos: [], aviso: 'No se pudo buscar en el catálogo' }),
      )
      .finally(() => vigente && setBuscando(false));
    return () => {
      vigente = false;
    };
  }, [inicial, servicio, terminoUrl]);

  return { ...datos, borrador, buscando, onCambiarBorrador: setBorrador };
}

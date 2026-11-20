import type { InterServicioBusqueda } from './InterServicioBusqueda';
import { UICATALOGO_DEFAULTS, type DatosUiCatalogo } from './InterUiCatalogo';
import { useUiCatalogoImplCliente } from './UiCatalogoImplCliente';
import { UiCatalogoView } from './UiCatalogoView';

export interface UiCatalogoProps {
  datos: DatosUiCatalogo;
  /** Solo en el cliente del sitio estático. */
  servicio?: InterServicioBusqueda;
  /** El parámetro q de la URL, leído por la entrada del navegador. */
  terminoUrl?: string | null;
}

/** Entrada: el mismo árbol en el servidor, en el generador estático y en el navegador. */
export function UiCatalogo({ datos, servicio, terminoUrl }: UiCatalogoProps) {
  const impl = useUiCatalogoImplCliente(datos, servicio, terminoUrl);
  return <UiCatalogoView {...UICATALOGO_DEFAULTS} {...impl} />;
}

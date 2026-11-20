import type { InterServicioCatalogo } from './InterServicioCatalogo';
import { UICATALOGO_DEFAULTS, type DatosUiCatalogo } from './InterUiCatalogo';
import { useUiCatalogoImplCliente } from './UiCatalogoImplCliente';
import { UiCatalogoView } from './UiCatalogoView';

export interface UiCatalogoProps {
  /** La cara de datos que calculó el servidor. */
  datos: DatosUiCatalogo;
  /** Solo en el cliente. El servidor dibuja la entrada sin servicio: allí no hay eventos. */
  servicio?: InterServicioCatalogo;
}

/** Entrada: el mismo árbol en el servidor (renderToString) y en el cliente (hydrateRoot). */
export function UiCatalogo({ datos, servicio }: UiCatalogoProps) {
  const impl = useUiCatalogoImplCliente(datos, servicio);
  return <UiCatalogoView {...UICATALOGO_DEFAULTS} {...impl} />;
}

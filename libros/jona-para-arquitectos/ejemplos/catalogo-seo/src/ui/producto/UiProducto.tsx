import { UIPRODUCTO_DEFAULTS, type DatosUiProducto } from './InterUiProducto';
import { useUiProductoImplCliente } from './UiProductoImplCliente';
import { UiProductoView } from './UiProductoView';

export interface UiProductoProps {
  datos: DatosUiProducto;
}

/** Entrada: el mismo árbol en el servidor, en el generador estático y en el navegador. */
export function UiProducto({ datos }: UiProductoProps) {
  const impl = useUiProductoImplCliente(datos);
  return <UiProductoView {...UIPRODUCTO_DEFAULTS} {...impl} />;
}

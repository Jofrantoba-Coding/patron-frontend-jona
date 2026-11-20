import { UINOENCONTRADO_DEFAULTS, type DatosUiNoEncontrado } from './InterUiNoEncontrado';
import { UiNoEncontradoView } from './UiNoEncontradoView';

export interface UiNoEncontradoProps {
  datos: DatosUiNoEncontrado;
}

/** Entrada: sin Implementación del cliente, porque la página no tiene interacción. */
export function UiNoEncontrado({ datos }: UiNoEncontradoProps) {
  return <UiNoEncontradoView {...UINOENCONTRADO_DEFAULTS} {...datos} />;
}

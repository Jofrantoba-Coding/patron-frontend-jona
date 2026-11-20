import { JLink, JPageLayout, JText } from '@jona-libro/ds-atomico';
import { RUTA_INICIO } from '../../compartido/rutas';
import type { InterUiNoEncontrado } from './InterUiNoEncontrado';

/** Vista pura: un h1 y un enlace real de vuelta al catálogo. */
export function UiNoEncontradoView({ titulo, mensaje, textoVolver }: InterUiNoEncontrado) {
  return (
    <JPageLayout title={titulo}>
      <JText>{mensaje}</JText>
      <JLink href={RUTA_INICIO}>{textoVolver}</JLink>
    </JPageLayout>
  );
}

import type { SesionUsuario } from '../../dominio/SesionUsuario';
import type { InterServicioCatalogo } from './InterServicioCatalogo';
import { UICATALOGO_DEFAULTS } from './InterUiCatalogo';
import { useUiCatalogoImpl } from './UiCatalogoImpl';
import { UiCatalogoView } from './UiCatalogoView';

export interface UiCatalogoProps {
  /** La sesión que respondió el servidor, con sus permisos. */
  sesion: SesionUsuario;
  servicio: InterServicioCatalogo;
  onSalir: () => void;
}

/** Entrada: DEFAULTS primero, la Implementación encima. */
export function UiCatalogo({ sesion, servicio, onSalir }: UiCatalogoProps) {
  return <UiCatalogoView {...UICATALOGO_DEFAULTS} {...useUiCatalogoImpl(sesion, servicio, onSalir)} />;
}

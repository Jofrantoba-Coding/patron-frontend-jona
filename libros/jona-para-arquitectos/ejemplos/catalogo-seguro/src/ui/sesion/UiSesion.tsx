import type { SesionUsuario } from '../../dominio/SesionUsuario';
import type { InterServicioSesion } from './InterServicioSesion';
import { UISESION_DEFAULTS } from './InterUiSesion';
import { useUiSesionImpl } from './UiSesionImpl';
import { UiSesionView } from './UiSesionView';

export interface UiSesionProps {
  servicio: InterServicioSesion;
  onEntro: (sesion: SesionUsuario) => void;
}

/** Entrada: DEFAULTS primero, la Implementación encima. */
export function UiSesion({ servicio, onEntro }: UiSesionProps) {
  return <UiSesionView {...UISESION_DEFAULTS} {...useUiSesionImpl(servicio, onEntro)} />;
}

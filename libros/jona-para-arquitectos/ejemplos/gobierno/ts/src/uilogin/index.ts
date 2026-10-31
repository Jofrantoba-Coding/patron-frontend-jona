import type { InterAuthService, Sesion } from '../servicios/InterAuthService.js';
import { UILOGIN_DEFAULTS, type InterUiLogin } from './InterUiLogin.js';
import { UiLoginImpl } from './UiLoginImpl.js';
import { UiLoginView } from './UiLoginView.js';

/** Entrada: lo único que el resto de la aplicación importa de la unidad (N4). */
export function crearUiLogin(servicio: InterAuthService, alAutenticar: (sesion: Sesion) => void): HTMLElement {
  const contenedor = document.createElement('div');
  const pintar = (modelo: InterUiLogin) => contenedor.replaceChildren(UiLoginView({ ...UILOGIN_DEFAULTS, ...modelo }));
  pintar(new UiLoginImpl(servicio, alAutenticar, pintar).modelo());
  return contenedor;
}

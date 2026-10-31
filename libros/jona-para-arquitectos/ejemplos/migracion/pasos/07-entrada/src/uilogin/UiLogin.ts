import { UILOGIN_DEFAULTS } from './InterUiLogin.js';
import { crearUiLoginImpl, type UiLoginImplDeps } from './UiLoginImpl.js';
import { crearUiLoginView, type PantallaLogin } from './UiLoginView.js';

/** Entrada: lo único que el resto de la aplicación importa de la unidad. Recibe el servicio; no lo elige. */
export function crearUiLogin(deps: UiLoginImplDeps): PantallaLogin {
  const vista = crearUiLoginView();
  crearUiLoginImpl(deps, (modelo) => vista.pintar({ ...UILOGIN_DEFAULTS, ...modelo }));
  return vista.pantalla;
}

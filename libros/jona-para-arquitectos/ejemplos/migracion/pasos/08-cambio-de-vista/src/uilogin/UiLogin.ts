import { Raiz } from '../../../../comun/declarativo.js';
import { UILOGIN_DEFAULTS } from './InterUiLogin.js';
import { crearUiLoginImpl, type UiLoginImplDeps } from './UiLoginImpl.js';
import { UiLoginView } from './UiLoginView.js';

/** Entrada: lo único que el resto de la aplicación importa de la unidad. Recibe el servicio; no lo elige. */
export function crearUiLogin(deps: UiLoginImplDeps): Raiz {
  const raiz = new Raiz();
  crearUiLoginImpl(deps, (modelo) => raiz.pintar(UiLoginView({ ...UILOGIN_DEFAULTS, ...modelo })));
  return raiz;
}

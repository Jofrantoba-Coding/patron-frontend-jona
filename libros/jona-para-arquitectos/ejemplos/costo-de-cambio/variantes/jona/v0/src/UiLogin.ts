import { UILOGIN_DEFAULTS } from './InterUiLogin.js';
import { createUiLoginImpl, type UiLoginImplDeps } from './UiLoginImpl.js';
import { createUiLoginView, type LoginScreen } from './UiLoginView.js';

/** Entrada: recibe el servicio, lo pasa a la Implementación y aplica los DEFAULTS a la Vista. */
export function createUiLogin(deps: UiLoginImplDeps): LoginScreen {
  const view = createUiLoginView();
  createUiLoginImpl(deps, (model) => view.render({ ...UILOGIN_DEFAULTS, ...model }));
  return view.screen;
}

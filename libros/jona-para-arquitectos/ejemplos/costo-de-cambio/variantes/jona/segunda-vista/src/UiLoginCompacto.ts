import { UILOGIN_DEFAULTS } from './InterUiLogin.js';
import { createUiLoginImpl, type UiLoginImplDeps } from './UiLoginImpl.js';
import { createUiLoginCompactoView, type LoginCompactoScreen } from './UiLoginCompactoView.js';

/** Segunda entrada: la misma Implementación, otra Vista. */
export function createUiLoginCompacto(deps: UiLoginImplDeps): LoginCompactoScreen {
  const view = createUiLoginCompactoView();
  createUiLoginImpl(deps, (model) => view.render({ ...UILOGIN_DEFAULTS, ...model }));
  return view.screen;
}

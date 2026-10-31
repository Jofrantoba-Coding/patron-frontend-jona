import { LoginPresenter, type LoginPresenterDeps } from './LoginPresenter.js';
import { LoginView } from './LoginView.js';

/** Ensamblado: MVP no nombra a quién crea las piezas; aquí se hace a mano. */
export function createMvpLogin(deps: LoginPresenterDeps): LoginView {
  const view = new LoginView();
  view.attach(new LoginPresenter(view, deps));
  return view;
}

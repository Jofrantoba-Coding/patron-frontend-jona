import { LoginView } from './LoginView.js';
import { LoginViewModel, type LoginViewModelDeps } from './LoginViewModel.js';

/** Ensamblado: MVVM no nombra a quién crea las piezas; aquí se hace a mano. */
export function createMvvmLogin(deps: LoginViewModelDeps): LoginView {
  return new LoginView(new LoginViewModel(deps));
}

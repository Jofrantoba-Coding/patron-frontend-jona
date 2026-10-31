import { LoginController } from './LoginController.js';
import { LoginModel, type LoginModelDeps } from './LoginModel.js';
import { LoginView } from './LoginView.js';

/** Ensamblado: MVC no nombra a quién crea las piezas; aquí se hace a mano. */
export function createMvcLogin(deps: LoginModelDeps): LoginView {
  const model = new LoginModel(deps);
  return new LoginView(model, new LoginController(model));
}

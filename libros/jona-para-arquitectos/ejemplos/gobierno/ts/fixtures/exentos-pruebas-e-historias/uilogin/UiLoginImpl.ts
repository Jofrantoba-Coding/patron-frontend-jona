import type { InterAuthService } from '../servicios/InterAuthService';
import type { InterUiLogin } from './InterUiLogin';

export function crearUiLoginImpl(servicio: InterAuthService): InterUiLogin {
  const modelo: InterUiLogin = { correo: '', onEnviar: () => { void servicio.login(modelo.correo); } };
  return modelo;
}

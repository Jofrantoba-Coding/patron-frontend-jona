import { AuthServiceHttp } from '../servicios/AuthServiceHttp';
import type { InterUiLogin } from './InterUiLogin';

export function crearUiLoginImpl(): InterUiLogin {
  const servicio = new AuthServiceHttp();
  const modelo: InterUiLogin = { correo: '', onEnviar: () => { void servicio.login(modelo.correo); } };
  return modelo;
}

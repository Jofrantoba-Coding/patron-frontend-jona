import type { AuthServiceHttp } from '../servicios/AuthServiceHttp';

export interface InterUiLogin {
  correo: string;
  servicio?: AuthServiceHttp;
  onEnviar?: () => void;
}

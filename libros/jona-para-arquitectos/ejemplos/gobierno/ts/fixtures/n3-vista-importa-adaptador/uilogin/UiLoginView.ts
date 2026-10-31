import { AuthServiceHttp } from '../servicios/AuthServiceHttp';
import type { InterUiLogin } from './InterUiLogin';

export const UiLoginView = (modelo: InterUiLogin) => {
  void new AuthServiceHttp().login(modelo.correo);
  return `<form>${modelo.correo}</form>`;
};

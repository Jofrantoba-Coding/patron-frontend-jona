import type { InterUiLogin } from './InterUiLogin';

export const UiLoginView = (modelo: InterUiLogin) =>
  `<form>${modelo.correo || sessionStorage.getItem('correo')}</form>`;

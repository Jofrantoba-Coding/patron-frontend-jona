import type { InterUiLogin } from './InterUiLogin';

/** Plantilla: comportamiento por defecto, sin integración. */
export class UiLogin implements InterUiLogin {
  login(_correo: string): void {}
}

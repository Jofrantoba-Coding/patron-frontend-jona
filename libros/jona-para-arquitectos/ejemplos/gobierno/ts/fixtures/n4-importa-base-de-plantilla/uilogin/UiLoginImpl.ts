import { UiLogin } from './UiLogin';

/** Implementación y entrada: reemplaza lo que necesita integración. */
export class UiLoginImpl extends UiLogin {
  override login(correo: string): void { console.log(correo); }
}

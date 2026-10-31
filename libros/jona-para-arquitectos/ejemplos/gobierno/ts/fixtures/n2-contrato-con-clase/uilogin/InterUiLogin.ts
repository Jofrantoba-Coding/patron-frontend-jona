export interface InterUiLogin {
  correo: string;
  onEnviar?: () => void;
}

export class ValidadorUiLogin {
  valido(correo: string): boolean { return correo !== ''; }
}

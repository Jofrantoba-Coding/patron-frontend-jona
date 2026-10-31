export interface InterUiLogin {
  correo: string;
  onEnviar?: () => void;
}

export function esCorreoValido(correo: string): boolean {
  return correo.includes('@');
}

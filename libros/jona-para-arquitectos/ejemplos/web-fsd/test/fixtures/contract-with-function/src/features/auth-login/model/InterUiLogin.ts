export interface InterUiLogin {
  email: string;
}

export const UILOGIN_DEFAULTS = { title: 'Iniciar sesión' };

// Violación: un contrato de UI no contiene comportamiento.
export function isValidData(email: string): boolean {
  return email !== '';
}

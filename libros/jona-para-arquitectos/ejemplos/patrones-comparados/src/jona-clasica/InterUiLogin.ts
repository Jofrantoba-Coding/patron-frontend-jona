/** Contrato de UI, estilo capacidades: lo que la pantalla sabe hacer. */
export interface InterUiLogin {
  login(email: string, password: string): void;
  isValidData(email: string, password: string): boolean;
}

// Contrato de UI: lo que la unidad sabe hacer. Solo firmas.
export interface InterUiIniciarSesion {
  login(email: string): void;
}

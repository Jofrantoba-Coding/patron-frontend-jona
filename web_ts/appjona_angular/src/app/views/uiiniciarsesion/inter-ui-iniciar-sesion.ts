// inter-ui-iniciar-sesion.ts
// Capa: Interface (contrato puro)
// Responsabilidad: declarar las firmas de los métodos públicos de la vista de login
// Restricciones: sin lógica, sin estado, sin imports externos
export interface InterUiIniciarSesion {
  login: (email: string, password: string) => void;
  goToCreateAccount: () => void;
  goToRecoverPassword: () => void;
  isValidData: (email: string, password: string) => boolean;
}

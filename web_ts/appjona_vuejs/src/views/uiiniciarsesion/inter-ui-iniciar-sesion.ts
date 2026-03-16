// inter-ui-iniciar-sesion.ts
// Capa: Interface — contrato que deben cumplir Template e Implementation
export interface InterUiIniciarSesion {
  login: (email: string, password: string) => void
  goToCreateAccount: () => void
  goToRecoverPassword: () => void
  isValidData: (email: string, password: string) => boolean
}

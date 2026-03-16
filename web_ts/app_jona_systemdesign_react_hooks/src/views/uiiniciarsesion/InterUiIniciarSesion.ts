// InterUiIniciarSesion.ts — Level 3: Organism / JONA Layer: Interface (Contract)
// Pure contract. No logic, no state, no rendering.
// Shared between Template and Implementation.
export interface InterUiIniciarSesion {
  login: (email: string, password: string) => void;
  goToCreateAccount: () => void;
  goToRecoverPassword: () => void;
  isValidData: (email: string, password: string) => boolean;
}

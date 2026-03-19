// Capa: Interface
// Responsabilidad: definir el contrato público del organismo de login.
// Restricciones: solo firmas, sin estado y sin lógica.
export interface InterUiIniciarSesion {
  login(email: string, password: string): void;
  goToCreateAccount(): void;
  goToRecoverPassword(): void;
  isValidData(email: string, password: string): boolean;
}

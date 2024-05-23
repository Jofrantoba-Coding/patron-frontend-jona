// UiLoginPage.interface.tsx

// Interfaz que define los métodos de la interfaz de inicio de sesión
export interface InterUiIniciarSesion {
  login: (email: string, password: string) => void;
  irCrearCuenta: () => void;
  irRecuperarClave: () => void;
  isValidData: (email: string, password: string) => boolean;
}
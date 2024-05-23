// InterUiIniciarSesion.tsx
export interface InterUiIniciarSesion {
  login: (email: string, password: string) => void;
  irCrearCuenta: () => void;
  irRecuperarClave: () => void;
}
// UiIniciarSesionProps.tsx
import { InterUiIniciarSesion } from './InterUiIniciarSesion';

export interface UiIniciarSesionProps extends InterUiIniciarSesion {
  goToCreateAccount: () => void;
  goToRecoverPassword: () => void;
}

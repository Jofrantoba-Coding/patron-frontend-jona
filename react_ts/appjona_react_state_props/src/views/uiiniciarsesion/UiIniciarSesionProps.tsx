// UiIniciarSesionProps.tsx
import { InterUiIniciarSesion } from './InterUiIniciarSesion';
import { NavigateFunction } from 'react-router-dom';

export interface UiIniciarSesionProps extends InterUiIniciarSesion {
  goToCreateAccount: () => void;
  goToRecoverPassword: () => void;
  navigate: NavigateFunction;
}

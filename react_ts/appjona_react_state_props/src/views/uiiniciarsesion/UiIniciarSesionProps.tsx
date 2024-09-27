import { InterUiIniciarSesion } from './InterUiIniciarSesion';
export interface UiIniciarSesionProps extends InterUiIniciarSesion {
    irCrearCuenta: () => void;
    irRecuperarClave: () => void;
}
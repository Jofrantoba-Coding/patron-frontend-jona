// Modelo base: estado y comportamiento por defecto, sin efectos.
import type { InterUiIniciarSesion } from './InterUiIniciarSesion.js';
import type { UiIniciarSesionProps } from './UiIniciarSesionProps.js';

export interface UiIniciarSesionTemplateModel extends InterUiIniciarSesion, UiIniciarSesionProps {
  setMensaje(valor: string): void;
}

export function useUiIniciarSesion(): UiIniciarSesionTemplateModel {
  const modelo: UiIniciarSesionTemplateModel = {
    email: '',
    mensaje: '',
    setMensaje(valor) {
      modelo.mensaje = valor;
    },
    login() {
      modelo.setMensaje('El modelo base no autentica; eso le toca a la Implementación.');
    },
    handlerLogin() {
      modelo.login(modelo.email);
    },
  };
  return modelo;
}

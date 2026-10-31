// Render: pinta las props que recibe. No conoce la Implementación.
import type { UiIniciarSesionProps } from './UiIniciarSesionProps.js';

export function UiIniciarSesion(props: UiIniciarSesionProps): string {
  return `<form><input value="${props.email}"><p>${props.mensaje}</p></form>`;
}

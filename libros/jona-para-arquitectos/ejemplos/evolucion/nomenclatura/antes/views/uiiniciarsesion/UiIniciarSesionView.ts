// Orquestador: instancia la Implementación y se la entrega al render.
import { UiIniciarSesion } from './UiIniciarSesion.js';
import { useUiIniciarSesionImpl } from './UiIniciarSesionImpl.js';

export function UiIniciarSesionView(email: string): string {
  const impl = useUiIniciarSesionImpl();
  impl.email = email;
  impl.handlerLogin();
  return UiIniciarSesion(impl);
}

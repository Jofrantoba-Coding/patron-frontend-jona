// Orquestador: instancia la Implementación y se la entrega al render.
import { UiIniciarSesionView } from './UiIniciarSesionView.js';
import { useUiIniciarSesionImpl } from './UiIniciarSesionImpl.js';

export function UiIniciarSesion(email: string): string {
  const impl = useUiIniciarSesionImpl();
  impl.email = email;
  impl.handlerLogin();
  return UiIniciarSesionView(impl);
}

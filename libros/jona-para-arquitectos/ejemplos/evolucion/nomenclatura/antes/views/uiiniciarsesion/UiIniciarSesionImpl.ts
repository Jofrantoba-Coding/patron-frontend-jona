// Implementación: sobrescribe el comportamiento del modelo base con el real.
import { useUiIniciarSesion, type UiIniciarSesionTemplateModel } from './UiIniciarSesionTemplateModel.js';

const autenticarPorDominio = (email: string) => email.endsWith('@jona.dev');

export function useUiIniciarSesionImpl(autenticar = autenticarPorDominio): UiIniciarSesionTemplateModel {
  const base = useUiIniciarSesion();
  return Object.assign(base, {
    login(email: string) {
      base.setMensaje(autenticar(email) ? `Bienvenida, ${email}` : 'Credenciales inválidas');
    },
  });
}

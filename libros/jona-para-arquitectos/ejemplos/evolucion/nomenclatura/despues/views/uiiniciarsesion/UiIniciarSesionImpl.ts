// Implementación: sobrescribe el comportamiento del modelo base con el real.
import { useUiIniciarSesionBase, type UiIniciarSesionBase } from './UiIniciarSesionBase.js';

const autenticarPorDominio = (email: string) => email.endsWith('@jona.dev');

export function useUiIniciarSesionImpl(autenticar = autenticarPorDominio): UiIniciarSesionBase {
  const base = useUiIniciarSesionBase();
  return Object.assign(base, {
    login(email: string) {
      base.setMensaje(autenticar(email) ? `Bienvenida, ${email}` : 'Credenciales inválidas');
    },
  });
}

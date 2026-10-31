// Composición raíz: monta la unidad de inicio de sesión.
// La aplicación importa el archivo que compone la unidad (instancia la Implementación y la entrega al render).
import { UiIniciarSesion } from './views/uiiniciarsesion/UiIniciarSesion.js';

export function App(email: string): string {
  return `<main>${UiIniciarSesion(email)}</main>`;
}

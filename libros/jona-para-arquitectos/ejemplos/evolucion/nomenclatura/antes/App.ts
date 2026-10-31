// Composición raíz: monta la unidad de inicio de sesión.
// La aplicación importa el archivo que compone la unidad (instancia la Implementación y la entrega al render).
import { UiIniciarSesionView } from './views/uiiniciarsesion/UiIniciarSesionView.js';

export function App(email: string): string {
  return `<main>${UiIniciarSesionView(email)}</main>`;
}

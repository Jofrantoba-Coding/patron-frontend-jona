import { crearJButton } from './jbutton/JButton.js';
import type { InterAuthService } from './servicios/InterAuthService.js';
import { crearUiLogin } from './uilogin/index.js';

/** Solo conoce las entradas de cada unidad (N4). El servicio llega desde main.ts. */
export function crearApp(servicio: InterAuthService): HTMLElement {
  const raiz = document.createElement('main');
  raiz.append(crearUiLogin(servicio, (sesion) => {
    const saludo = Object.assign(document.createElement('h1'), { textContent: `Hola, ${sesion.nombre}` });
    const salir = crearJButton({ texto: 'Cerrar sesión', variante: 'contorno', onClick: () => raiz.replaceWith(crearApp(servicio)) });
    raiz.replaceChildren(saludo, salir);
  }));
  return raiz;
}

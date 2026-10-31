import { Label } from '../../../comun/pantalla.js';
import { crearLogin } from './uilogin/UiLoginView.js';

/** La aplicación: la pantalla de login y un saludo cuando la persona entra. */
export function crearApp() {
  const saludo = new Label();
  const login = crearLogin((usuario) => {
    saludo.text = `Hola, ${usuario.nombre}`;
  });
  return { login, saludo };
}

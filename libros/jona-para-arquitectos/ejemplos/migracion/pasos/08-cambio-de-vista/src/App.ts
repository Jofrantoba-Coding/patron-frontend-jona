import { Label } from '../../../comun/pantalla.js';
import { crearAuthServiceHttp } from './servicios/AuthServiceHttp.js';
import { crearUiLogin } from './uilogin/UiLogin.js';

/** La aplicación: la pantalla de login y un saludo cuando la persona entra. Elige el adaptador y solo importa la entrada. */
export function crearApp() {
  const saludo = new Label();
  const login = crearUiLogin({
    servicio: crearAuthServiceHttp(),
    alAutenticar: (sesion) => {
      saludo.text = `Hola, ${sesion.usuario.nombre}`;
    },
  });
  return { login, saludo };
}

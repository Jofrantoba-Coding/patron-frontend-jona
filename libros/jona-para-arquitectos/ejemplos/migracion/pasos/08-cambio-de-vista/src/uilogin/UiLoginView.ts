import { h, type Nodo } from '../../../../comun/declarativo.js';
import type { InterUiLogin } from './InterUiLogin.js';

/** Vista declarativa: función pura del modelo de vista al árbol. No guarda estado ni produce efectos. */
export function UiLoginView(m: InterUiLogin): Nodo {
  return h('form', { id: 'login' },
    h('h1', { id: 'titulo' }, m.titulo ?? ''),
    h('input', { id: 'correo', valor: m.correo, deshabilitado: m.ocupada, alEscribir: m.alCambiarCorreo }),
    h('span', { id: 'error-correo' }, m.errorCorreo ?? ''),
    h('input', { id: 'clave', valor: m.clave, deshabilitado: m.ocupada, alEscribir: m.alCambiarClave }),
    h('span', { id: 'error-clave' }, m.errorClave ?? ''),
    h('button', { id: 'ingresar', clase: 'boton-primario', deshabilitado: m.ocupada, alPulsar: m.alEnviar }, m.textoBoton ?? ''),
    h('p', { id: 'mensaje' }, m.mensaje ?? ''));
}

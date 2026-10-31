import { crearJButton } from '../jbutton/JButton.js';
import type { InterUiLogin } from './InterUiLogin.js';

/** Vista: solo pinta lo que recibe y avisa con los callbacks del contrato. */
export function UiLoginView(modelo: InterUiLogin): HTMLFormElement {
  const formulario = document.createElement('form');
  formulario.setAttribute('aria-label', modelo.titulo ?? '');
  const correo = Object.assign(document.createElement('input'), { type: 'email', value: modelo.correo });
  correo.addEventListener('input', () => modelo.onCorreoChange?.(correo.value));
  const clave = Object.assign(document.createElement('input'), { type: 'password', value: modelo.clave });
  clave.addEventListener('input', () => modelo.onClaveChange?.(clave.value));
  const error = Object.assign(document.createElement('p'), { textContent: modelo.error ?? '' });
  const enviar = crearJButton({ texto: modelo.etiquetaEnviar ?? '', tipo: 'submit', deshabilitado: modelo.enviando });
  formulario.addEventListener('submit', (evento) => { evento.preventDefault(); modelo.onEnviar?.(); });
  formulario.append(correo, clave, error, enviar);
  return formulario;
}

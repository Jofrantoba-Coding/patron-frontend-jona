import type { InterJButton } from './InterJButton.js';

/** Vista: render puro. */
export function JButtonView({ texto, variante, tipo, deshabilitado, onClick }: InterJButton): HTMLButtonElement {
  const boton = Object.assign(document.createElement('button'), { type: tipo, textContent: texto, disabled: deshabilitado });
  boton.dataset.variante = variante;
  if (onClick) boton.addEventListener('click', () => onClick());
  return boton;
}

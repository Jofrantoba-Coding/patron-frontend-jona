import { JBUTTON_DEFAULTS, type InterJButton } from './InterJButton.js';
import { JButtonView } from './JButtonView.js';

/** Entrada: aplica los DEFAULTS y pinta la vista. Sin servicios, la unidad no necesita Implementación. */
export function crearJButton(props: InterJButton): HTMLButtonElement {
  return JButtonView({ ...JBUTTON_DEFAULTS, ...props });
}

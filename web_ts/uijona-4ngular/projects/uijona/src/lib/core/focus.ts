/**
 * Gestion del foco para superposiciones modales (JDialog, JOptionPane, JDrawer).
 *
 * `aria-modal="true"` le dice al lector de pantalla que el resto del documento es
 * inerte, pero NO detiene el Tab del navegador: sin trampa de foco el usuario de
 * teclado sale de la superposicion hacia controles que no puede ver. Estas tres
 * piezas —entrada, ciclo y retorno— son lo que convierte un panel con `role=dialog`
 * en un modal utilizable.
 *
 * No es parte de la API publica: la consumen los Impl, no los consumidores.
 */

/** Selector de lo que el navegador considera enfocable por teclado. */
const ENFOCABLES = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

/** Enfocables del subarbol, en orden de documento, descartando los ocultos. */
export function enfocablesEn(raiz: HTMLElement): HTMLElement[] {
  return Array.from(raiz.querySelectorAll<HTMLElement>(ENFOCABLES)).filter(
    (el) => !el.hasAttribute('hidden') && el.getAttribute('aria-hidden') !== 'true'
  );
}

/**
 * Trampa de foco de una superposicion. Una instancia por componente.
 *
 * El foco inicial va al PANEL, no al primer boton: en un `alertdialog` de borrado
 * el primer enfocable suele ser «Confirmar», y entrar con el foco puesto ahi
 * convierte un Enter distraido en una accion destructiva.
 */
export class JFocusTrap {
  private previo: HTMLElement | null = null;
  private activo = false;

  /** Guarda quien tenia el foco y lo mueve al panel. Repetirlo no pisa lo guardado. */
  activar(panel: HTMLElement): void {
    if (this.activo) return;
    this.activo = true;

    const raiz = panel.ownerDocument;
    const anterior = raiz.activeElement;
    this.previo = anterior instanceof HTMLElement && anterior !== raiz.body ? anterior : null;

    panel.focus();
    // Panel sin tabindex: el foco no se movio, se cae al primer enfocable.
    if (!panel.contains(raiz.activeElement)) enfocablesEn(panel)[0]?.focus();
  }

  /** Devuelve el foco a quien lo tenia antes de abrir. */
  liberar(): void {
    if (!this.activo) return;
    this.activo = false;

    const previo = this.previo;
    this.previo = null;
    if (previo?.isConnected) previo.focus();
  }

  /** Cicla el Tab dentro del panel. Llamar desde el `(keydown)` del panel. */
  alPulsarTecla(evento: KeyboardEvent, panel: HTMLElement): void {
    if (evento.key !== 'Tab') return;

    const items = enfocablesEn(panel);
    if (items.length === 0) {
      // Nada que enfocar dentro: el foco no debe escaparse igualmente.
      evento.preventDefault();
      return;
    }

    const primero = items[0];
    const ultimo = items[items.length - 1];
    const actual = panel.ownerDocument.activeElement;

    if (evento.shiftKey && (actual === primero || actual === panel)) {
      evento.preventDefault();
      ultimo.focus();
    } else if (!evento.shiftKey && (actual === ultimo || actual === panel)) {
      evento.preventDefault();
      primero.focus();
    }
  }
}

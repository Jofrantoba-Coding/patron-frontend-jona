import {
  ATRIBUTO_MODO_TEMA,
  MODO_TEMA_DEFAULTS,
  type InterModoTema,
  type ModoTema,
  type OpcionesModoTema,
} from './InterModoTema';

/**
 * Implementación: guarda el modo y lo escribe en la raíz. El CSS hace el resto:
 * los tokens semánticos cambian bajo `data-theme-mode`; las clases no.
 */
export class ModoTemaImpl implements InterModoTema {
  #modo: ModoTema;
  readonly #raiz: HTMLElement;

  constructor(opciones: OpcionesModoTema = {}, raiz: HTMLElement = document.documentElement) {
    this.#raiz = raiz;
    this.#modo = opciones.modoInicial ?? MODO_TEMA_DEFAULTS.modoInicial;
    this.#aplicar();
  }

  get modo(): ModoTema {
    return this.#modo;
  }

  cambiarModo(modo: ModoTema): void {
    this.#modo = modo;
    this.#aplicar();
  }

  #aplicar(): void {
    this.#raiz.setAttribute(ATRIBUTO_MODO_TEMA, this.#modo);
  }
}

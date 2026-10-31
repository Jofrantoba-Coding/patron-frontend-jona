// Contrato de la unidad de modo de tema. No depende de React: cualquier vista lo puede usar.

/** Elección del usuario. `system` sigue a `prefers-color-scheme`. */
export type ModoTema = 'system' | 'light' | 'dark';

export interface InterModoTema {
  readonly modo: ModoTema;
  cambiarModo(modo: ModoTema): void;
}

export interface OpcionesModoTema {
  /** Modo con el que arranca la aplicación. */
  modoInicial?: ModoTema;
}

/** Atributo de la raíz que activa los bloques oscuros de tokens.css. */
export const ATRIBUTO_MODO_TEMA = 'data-theme-mode';

/** Solo configuración; el modo vigente es estado y vive en la Implementación. */
export const MODO_TEMA_DEFAULTS = {
  modoInicial: 'system',
} as const satisfies Required<OpcionesModoTema>;

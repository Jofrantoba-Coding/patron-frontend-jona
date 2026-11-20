/**
 * Lo que puede salir mal al hablar con un backend, dicho en términos del BFF. Cada adaptador
 * traduce el formato de error de su servicio a este tipo; la capa HTTP lo traduce a un código
 * que la SPA entiende (404, 409 y cualquier otro).
 */
export type TipoErrorBackend = 'no-encontrado' | 'conflicto' | 'no-disponible';

export class ErrorBackend extends Error {
  constructor(
    readonly tipo: TipoErrorBackend,
    mensaje: string = tipo,
  ) {
    super(mensaje);
    this.name = 'ErrorBackend';
  }
}

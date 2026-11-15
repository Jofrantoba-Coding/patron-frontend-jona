/** Lo que puede salir mal en un repositorio, dicho en términos que la aplicación entiende. */
export type TipoErrorRepositorio = 'no-encontrado' | 'conflicto' | 'red';

/** Error de un adaptador de repositorio. Los adaptadores traducen a este tipo; nadie más ve un código HTTP. */
export class ErrorRepositorio extends Error {
  constructor(
    readonly tipo: TipoErrorRepositorio,
    mensaje: string = tipo,
  ) {
    super(mensaje);
    this.name = 'ErrorRepositorio';
  }
}

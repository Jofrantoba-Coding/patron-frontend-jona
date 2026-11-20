/**
 * Lo que el navegador sabe de la sesión: quién es y qué puede hacer. No hay token ni
 * identificador de sesión: esos viven en el BFF y en una cookie que JavaScript no puede leer.
 */
export interface SesionUsuario {
  usuario: { nombre: string };
  /** Calculados por el servidor a partir del rol. La UI los usa para dibujar, nunca para autorizar. */
  permisos: { eliminar: boolean };
}

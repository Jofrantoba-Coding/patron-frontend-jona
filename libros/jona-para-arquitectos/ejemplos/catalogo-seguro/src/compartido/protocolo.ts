// El protocolo entre el navegador y el BFF: lo único que comparten los dos lados.

/**
 * Cabecera propia que el cliente pone en cada petición a /api. Un formulario o un enlace de otro
 * sitio no pueden ponerla, y un fetch desde otro origen que la ponga necesita una consulta previa
 * (preflight) que el BFF no aprueba. El BFF rechaza toda petición a /api que no la traiga.
 */
export const CABECERA_CSRF = 'X-Jona-Csrf';
export const VALOR_CSRF = '1';

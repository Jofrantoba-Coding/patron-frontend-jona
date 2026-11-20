// Cómo viajan los datos del servidor al cliente: un <script type="application/json"> dentro del
// HTML. Las dos mitades del formato viven juntas: el servidor escribe, el cliente lee.

export const ID_DATOS = 'datos-catalogo';

/**
 * JSON que se puede poner dentro de un <script>. `<`, `>` y `&` se escriben con su secuencia de
 * escape de JSON (barra, u y cuatro dígitos): un nombre con `</script>` no cierra el elemento y
 * uno con `<!--` no abre un comentario.
 * U+2028 y U+2029 se escapan por los intérpretes de JavaScript antiguos. JSON.parse devuelve el
 * texto original: el escape solo existe dentro del HTML.
 */
export function serializarParaHtml(datos: unknown): string {
  return JSON.stringify(datos).replace(/[<>&\u2028\u2029]/g, (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, '0')}`);
}

/** Lee los datos que dejó el servidor. Recibe el documento: no toca globales. */
export function leerDatosIncrustados<T>(documento: Document): T {
  const texto = documento.getElementById(ID_DATOS)?.textContent;
  if (!texto) throw new Error(`Falta <script id="${ID_DATOS}"> con los datos del servidor`);
  return JSON.parse(texto) as T;
}

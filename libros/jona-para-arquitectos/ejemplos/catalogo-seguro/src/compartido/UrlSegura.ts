// Una URL que se puede poner en un href. El tipo lleva una marca que solo agrega aUrlSegura: un
// contrato que pide UrlSegura no acepta un texto sin validar, y la validación tiene un solo lugar.

declare const marca: unique symbol;

/** http o https, ya analizada y normalizada. Sirve donde el sistema de diseño pide un JLinkHref. */
export type UrlSegura = (`https://${string}` | `http://${string}`) & { readonly [marca]: 'UrlSegura' };

/**
 * La URL si es http o https; si no, nada. Usa el analizador de URL del navegador y no una
 * expresión regular: el mismo que usará el navegador al seguir el enlace, con sus mayúsculas,
 * sus espacios iniciales y sus tabuladores dentro del esquema.
 */
export function aUrlSegura(texto: string): UrlSegura | undefined {
  let url: URL;
  try {
    url = new URL(texto);
  } catch {
    return undefined;
  }
  return url.protocol === 'https:' || url.protocol === 'http:' ? (url.href as UrlSegura) : undefined;
}

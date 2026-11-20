// Las cabeceras de seguridad, en un solo lugar: el servidor no las arma ruta por ruta.
import { randomBytes } from 'node:crypto';

/** 128 bits nuevos para cada respuesta. Un nonce que se repite o se adivina no protege nada. */
export const generarNonce = () => randomBytes(16).toString('base64');

/**
 * CSP estricta, la de la hoja de OWASP: solo corren los scripts con el nonce de esta respuesta,
 * y los que ellos carguen ('strict-dynamic'). Además, la página no se puede enmarcar.
 */
export function politicaDeContenido(nonce: string): string {
  return [`script-src 'nonce-${nonce}' 'strict-dynamic'`, "object-src 'none'", "base-uri 'none'", "frame-ancestors 'none'"].join('; ');
}

const COMUNES = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Cross-Origin-Opener-Policy': 'same-origin',
  // Las respuestas dependen de la sesión: ninguna caché intermedia debe guardarlas.
  'Cache-Control': 'no-store',
} as const;

export function cabecerasDocumento(nonce: string) {
  return { ...COMUNES, 'Content-Type': 'text/html; charset=utf-8', 'Content-Security-Policy': politicaDeContenido(nonce) };
}

export const CABECERAS_API = { ...COMUNES, 'Content-Type': 'application/json; charset=utf-8' } as const;

/** Los archivos de dist/client no cambian con la sesión: no llevan no-store. */
export const CABECERAS_ESTATICOS = { 'X-Content-Type-Options': 'nosniff' } as const;

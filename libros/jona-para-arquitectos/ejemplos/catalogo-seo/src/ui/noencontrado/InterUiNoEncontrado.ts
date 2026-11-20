// Contrato de UI de la página «no encontrada». La misma página en los dos modos: el servidor SSR
// la responde con estado 404, y el sitio estático la publica como 404.html. No depende de la ruta
// pedida: así el archivo estático y la respuesta del servidor son idénticos.

/** Cara de datos: vacía a propósito. */
export interface DatosUiNoEncontrado {}

export interface TextosUiNoEncontrado {
  titulo: string;
  mensaje: string;
  textoVolver: string;
}

export interface InterUiNoEncontrado extends DatosUiNoEncontrado, TextosUiNoEncontrado {}

export const UINOENCONTRADO_DEFAULTS = {
  titulo: 'Página no encontrada',
  mensaje: 'La dirección no corresponde a ningún producto ni página del catálogo.',
  textoVolver: 'Ir al catálogo',
} as const satisfies TextosUiNoEncontrado;

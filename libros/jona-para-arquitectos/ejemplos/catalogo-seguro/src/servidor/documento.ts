// El index.html de cada respuesta. Vite deja una marca en el atributo nonce de cada <script> y
// <style> (html.cspNonce en vite.config.ts); aquí se reemplaza por el nonce de esta respuesta.
// Por eso el HTML lo entrega el BFF y no un servidor de archivos: un HTML estático tendría
// siempre el mismo nonce.

export const MARCA_NONCE = 'NONCE_POR_RESPUESTA';

export function componerDocumento(plantilla: string, nonce: string): string {
  // El nonce va dentro de un atributo: solo se acepta base64, que no puede cerrarlo.
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(nonce)) throw new Error('El nonce no es base64');
  return plantilla.replaceAll(MARCA_NONCE, () => nonce);
}

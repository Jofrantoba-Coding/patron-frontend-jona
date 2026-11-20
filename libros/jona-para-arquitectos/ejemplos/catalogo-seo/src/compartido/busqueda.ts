// Qué significa que un producto coincida con un término. Una sola definición: la usa el
// repositorio en el servidor y la búsqueda del sitio estático en el navegador.

const normalizar = (texto: string) => texto.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

/** Coincide por nombre o por SKU, sin distinguir mayúsculas ni tildes. Un término vacío no coincide con nada. */
export function coincide(termino: string, producto: { sku: string; nombre: string }): boolean {
  const buscado = normalizar(termino.trim());
  return buscado !== '' && (normalizar(producto.nombre).includes(buscado) || normalizar(producto.sku).includes(buscado));
}

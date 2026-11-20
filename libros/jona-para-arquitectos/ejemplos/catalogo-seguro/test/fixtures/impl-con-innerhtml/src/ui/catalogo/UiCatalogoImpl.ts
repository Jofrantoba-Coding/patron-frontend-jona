// Violación de la regla 1: la Implementación escribe el aviso directamente en el DOM.
export function avisar(mensaje: string) {
  document.getElementById('aviso')!.innerHTML = `<strong>${mensaje}</strong>`;
}

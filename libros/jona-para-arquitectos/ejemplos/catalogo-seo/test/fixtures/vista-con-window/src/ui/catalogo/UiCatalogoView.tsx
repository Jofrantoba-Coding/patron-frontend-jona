// Violación de la regla 3: la vista lee el término de la URL del navegador. En el servidor no hay
// window, y en el sitio estático el término no existía al prerenderizar.
export function UiCatalogoView() {
  const termino = new URLSearchParams(window.location.search).get('q');
  return <p>{termino}</p>;
}

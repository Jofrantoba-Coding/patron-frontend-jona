// Violación de la regla 3: la vista decide con window, que no existe en el servidor. Allí falla,
// y si se la protegiera con typeof, dibujaría una cosa en el servidor y otra en el navegador.
export function UiCatalogoView({ termino }: { termino: string }) {
  const compacta = window.innerWidth < 600;
  return <p>{compacta ? termino : `Resultados para ${termino}`}</p>;
}

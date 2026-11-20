// Violación de la regla 3: la vista lee el reloj. El servidor y el navegador dibujan horas
// distintas y la hidratación no coincide (src/ui/catalogo/hidratacion.test.tsx lo muestra en ejecución).
export function UiCatalogoView({ termino }: { termino: string }) {
  return <p>Resultados para {termino}, a las {Date.now()}</p>;
}

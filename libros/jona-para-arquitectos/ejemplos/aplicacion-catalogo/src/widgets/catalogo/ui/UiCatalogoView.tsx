import type { InterUiCatalogo } from '../model/InterUiCatalogo';

/** Vista: la lista y, encima, el diálogo. Render puro: no conoce el repositorio ni las funcionalidades. */
export function UiCatalogoView({ lista, dialogo }: InterUiCatalogo) {
  return (
    <section aria-label="Catálogo">
      {lista}
      {dialogo}
    </section>
  );
}

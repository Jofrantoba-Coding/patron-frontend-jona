import { UiCatalogo, type InterServicioBusqueda } from './catalogo';
import type { DatosPagina } from './InterPagina';
import { UiNoEncontrado } from './noencontrado';
import { UiProducto } from './producto';

/** Lo que solo existe en el navegador. En el servidor y en el generador estático, nada. */
export interface ServiciosCliente {
  busqueda?: InterServicioBusqueda;
  terminoUrl?: string | null;
}

/** La unidad de la página. El mismo árbol en los tres lugares que dibujan: SSR, estático y navegador. */
export function Pagina({ pagina, servicios }: { pagina: DatosPagina; servicios?: ServiciosCliente }) {
  switch (pagina.unidad) {
    case 'catalogo':
      return <UiCatalogo datos={pagina.datos} servicio={servicios?.busqueda} terminoUrl={servicios?.terminoUrl} />;
    case 'producto':
      return <UiProducto datos={pagina.datos} />;
    case 'no-encontrado':
      return <UiNoEncontrado datos={pagina.datos} />;
  }
}

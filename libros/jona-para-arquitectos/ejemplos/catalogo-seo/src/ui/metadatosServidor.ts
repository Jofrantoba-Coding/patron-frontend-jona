// Los metadatos de cualquier página: elige la función pura de su unidad. Código del servidor.
import type { InterMetadatosPagina, InterSitio } from '../seo/InterMetadatosPagina';
import { metadatosUiCatalogo } from './catalogo/indexServidor';
import type { DatosPagina } from './InterPagina';
import { metadatosUiNoEncontrado } from './noencontrado/indexServidor';
import { metadatosUiProducto } from './producto/indexServidor';

export function metadatosDePagina(pagina: DatosPagina, sitio: InterSitio): InterMetadatosPagina {
  switch (pagina.unidad) {
    case 'catalogo':
      return metadatosUiCatalogo(pagina.datos, sitio);
    case 'producto':
      return metadatosUiProducto(pagina.datos, sitio);
    case 'no-encontrado':
      return metadatosUiNoEncontrado(pagina.datos, sitio);
  }
}

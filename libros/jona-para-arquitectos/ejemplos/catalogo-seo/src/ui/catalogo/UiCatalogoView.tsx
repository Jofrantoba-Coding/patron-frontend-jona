// Vista pura (regla 3 de test/architecture), compuesta solo con el sistema de diseño. El SEO que
// le toca a una vista está en qué compone: un h1 (el de JPageLayout), un h2 por producto, un
// enlace real a cada ficha (JLink) y las imágenes con sus dimensiones (JImage). El buscador es un
// formulario GET: busca también sin JavaScript.
import { JButton, JHeading, JImage, JInput, JLink, JPageLayout, JText } from '@jona-libro/ds-atomico';
import { RUTA_BUSQUEDA, rutaProducto } from '../../compartido/rutas';
import type { InterUiCatalogo } from './InterUiCatalogo';

export function UiCatalogoView({
  termino, productos, aviso, borrador, buscando,
  titulo, tituloBusqueda, etiquetaBuscar, textoBuscar, textoVacio, textoSinTermino, textoBuscando,
  onCambiarBorrador,
}: InterUiCatalogo) {
  const esBusqueda = termino !== undefined;
  const sinResultados = esBusqueda && productos.length === 0 && !buscando;
  return (
    <JPageLayout title={esBusqueda ? tituloBusqueda : titulo}>
      <form role="search" aria-label={etiquetaBuscar} action={RUTA_BUSQUEDA} method="get">
        <JInput type="search" name="q" value={borrador} onChange={onCambiarBorrador} aria-label={etiquetaBuscar} />
        <JButton type="submit" variant="secondary">{textoBuscar}</JButton>
      </form>
      {aviso && <JText tone="danger" role="alert">{aviso}</JText>}
      <JText tone="muted" role="status">{buscando ? textoBuscando : sinResultados ? (termino ? textoVacio : textoSinTermino) : ''}</JText>
      <ul>
        {productos.map((p) => (
          <li key={p.sku}>
            <JImage src={p.imagen.src} alt={p.imagen.alt} width={p.imagen.ancho} height={p.imagen.alto} />
            <JHeading level={2} size="md">
              <JLink href={rutaProducto(p.sku)}>{p.nombre}</JLink>
            </JHeading>
            <JText>{p.precio}{p.disponible ? '' : ' · Agotado'}</JText>
          </li>
        ))}
      </ul>
    </JPageLayout>
  );
}

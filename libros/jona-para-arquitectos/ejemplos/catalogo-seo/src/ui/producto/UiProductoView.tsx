// Vista pura de la ficha. El h1 es el nombre (lo dibuja JPageLayout con JHeading level 1), la
// imagen principal lleva prioridad (es la que se ve sin desplazarse), y los títulos siguientes son h2.
import { JButton, JHeading, JImage, JLink, JPageLayout, JText } from '@jona-libro/ds-atomico';
import { RUTA_INICIO } from '../../compartido/rutas';
import type { InterUiProducto } from './InterUiProducto';

export function UiProductoView({
  sku, nombre, descripcion, precioTexto, stock, imagen, enCarrito,
  textoAgregar, textoAgotado, tituloDetalles, textoVolver,
  onAgregar,
}: InterUiProducto) {
  const disponible = stock > 0;
  return (
    <JPageLayout title={nombre}>
      <JImage src={imagen.src} alt={imagen.alt} width={imagen.ancho} height={imagen.alto} prioridad />
      <JText>{precioTexto}</JText>
      <JText tone={disponible ? 'default' : 'muted'}>{disponible ? `${stock} unidades disponibles` : textoAgotado}</JText>
      <JButton onClick={onAgregar} disabled={!disponible || enCarrito >= stock}>{textoAgregar}</JButton>
      <JText tone="muted" role="status">{enCarrito > 0 ? `En el carrito: ${enCarrito}` : ''}</JText>
      <JHeading level={2}>{tituloDetalles}</JHeading>
      <JText>{descripcion}</JText>
      <JText tone="muted">SKU: {sku}</JText>
      <JLink href={RUTA_INICIO}>{textoVolver}</JLink>
    </JPageLayout>
  );
}

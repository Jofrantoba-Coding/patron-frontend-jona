// Violación de la regla 1: la descripción «con formato» se inserta como HTML.
import type { FilaProductoUi } from './InterUiCatalogo';

export function DescripcionView({ fila }: { fila: FilaProductoUi }) {
  return <p dangerouslySetInnerHTML={{ __html: fila.descripcion }} />;
}

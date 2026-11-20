// Vista pura: dibuja solo lo que recibe. Ni window, ni document, ni la hora, ni azar (regla 3 de
// test/architecture): lo que dibuja en el servidor tiene que ser idéntico a lo que dibuja al hidratar.
// El buscador se compone con átomos y no con JSearchBox porque su borrador inicial viene del
// servidor (?q=), y JSearchBox guarda el suyo adentro y empieza vacío.
import { JButton, JConfirmDialog, JInput, JPageLayout, JTable, JText, type JTableColumn } from '@jona-libro/ds-atomico';
import type { FilaProductoUi, InterUiCatalogo } from './InterUiCatalogo';

const COLUMNAS: JTableColumn<FilaProductoUi>[] = [
  { id: 'sku', header: 'SKU', cell: (f) => f.sku },
  { id: 'nombre', header: 'Nombre', cell: (f) => f.nombre },
  { id: 'precio', header: 'Precio', cell: (f) => f.precio, align: 'end' },
  { id: 'stock', header: 'Stock', cell: (f) => f.stock, align: 'end' },
];

export function UiCatalogoView({
  productos, aviso, borrador, pendiente, aEliminar, error,
  titulo, etiquetaBuscar, textoBuscar, textoVacio, textoMensajeEliminar, textoConfirmarEliminar,
  onCambiarBorrador, onBuscar, onPedirEliminar, onConfirmarEliminar, onCancelarEliminar,
}: InterUiCatalogo) {
  const alerta = aEliminar ? aviso : (error ?? aviso);
  return (
    <JPageLayout title={titulo}>
      <form
        role="search"
        aria-label={etiquetaBuscar}
        onSubmit={(evento) => {
          evento.preventDefault();
          onBuscar();
        }}
      >
        <JInput type="search" value={borrador} onChange={onCambiarBorrador} aria-label={etiquetaBuscar} placeholder="Nombre o SKU" />
        <JButton type="submit" variant="secondary" disabled={pendiente}>{textoBuscar}</JButton>
      </form>
      {alerta && <JText tone="danger" role="alert">{alerta}</JText>}
      <JTable
        caption="Productos"
        columns={COLUMNAS}
        rows={productos}
        rowKey={(f) => f.id}
        busy={pendiente && !aEliminar}
        emptyMessage={textoVacio}
        actions={[{ id: 'eliminar', label: 'Eliminar', accessibleLabel: (f) => `Eliminar ${f.nombre}`, onAction: onPedirEliminar }]}
      />
      <JConfirmDialog
        open={aEliminar !== undefined}
        title={`¿Eliminar ${aEliminar?.nombre ?? ''}?`}
        message={error ?? textoMensajeEliminar}
        confirmLabel={textoConfirmarEliminar}
        busy={pendiente}
        onConfirm={onConfirmarEliminar}
        onCancel={onCancelarEliminar}
      />
    </JPageLayout>
  );
}

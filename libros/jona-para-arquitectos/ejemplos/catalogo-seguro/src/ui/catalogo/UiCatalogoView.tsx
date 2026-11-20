// Vista pura. Cada texto del producto entra como hijo de un elemento, y React lo escribe como
// texto: un nombre con <img onerror> se ve, no se ejecuta. Ni dangerouslySetInnerHTML ni HTML
// armado con cadenas (regla 1 de test/architecture). El enlace solo existe si la fila lo trae.
import { JButton, JConfirmDialog, JLink, JPageLayout, JTable, JText, type JTableAction, type JTableColumn } from '@jona-libro/ds-atomico';
import type { FilaProductoUi, InterUiCatalogo } from './InterUiCatalogo';

export function UiCatalogoView({
  usuario, permisos, productos, cargando, pendiente, aEliminar, error,
  titulo, textoSesion, textoSalir, textoVacio, textoFabricante, textoMensajeEliminar, textoConfirmarEliminar,
  textoErrorCarga, textoErrorProhibido, textoErrorEliminar,
  onPedirEliminar, onConfirmarEliminar, onCancelarEliminar, onSalir,
}: InterUiCatalogo) {
  const columnas: JTableColumn<FilaProductoUi>[] = [
    { id: 'sku', header: 'SKU', cell: (f) => f.sku },
    { id: 'nombre', header: 'Nombre', cell: (f) => f.nombre },
    { id: 'descripcion', header: 'Descripción', cell: (f) => f.descripcion },
    { id: 'precio', header: 'Precio', cell: (f) => f.precio, align: 'end' },
    {
      id: 'fabricante',
      header: 'Fabricante',
      cell: (f) => (f.enlace ? <JLink href={f.enlace} rel="external noopener noreferrer" aria-label={`${textoFabricante}: ${f.nombre}`}>{textoFabricante}</JLink> : '—'),
    },
  ];
  // Ofrecer no es permitir: sin el permiso, la acción no se dibuja; con él, el servidor igual decide.
  const acciones: JTableAction<FilaProductoUi>[] | undefined = permisos.eliminar
    ? [{ id: 'eliminar', label: 'Eliminar', accessibleLabel: (f) => `Eliminar ${f.nombre}`, onAction: onPedirEliminar }]
    : undefined;
  const mensajes = { carga: textoErrorCarga, prohibido: textoErrorProhibido, eliminar: textoErrorEliminar };

  return (
    <JPageLayout title={titulo} actions={<JButton variant="secondary" onClick={onSalir}>{textoSalir}</JButton>}>
      <JText tone="muted">{`${textoSesion} ${usuario}`}</JText>
      {error && <JText tone="danger" role="alert">{mensajes[error]}</JText>}
      <JTable caption={titulo} columns={columnas} rows={productos} rowKey={(f) => f.id} busy={cargando} emptyMessage={textoVacio} actions={acciones} />
      <JConfirmDialog
        open={aEliminar !== undefined}
        title={`¿Eliminar ${aEliminar?.nombre ?? ''}?`}
        message={textoMensajeEliminar}
        confirmLabel={textoConfirmarEliminar}
        busy={pendiente}
        onConfirm={onConfirmarEliminar}
        onCancel={onCancelarEliminar}
      />
    </JPageLayout>
  );
}

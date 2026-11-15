// Vista: compone el buscador (molécula) y la tabla (organismo genérico) del sistema de diseño.
// Lo que es propio del producto, las columnas y las acciones, se decide aquí.
import { JSearchBox, JTable, JText, type JTableColumn } from '@jona-libro/ds-atomico';
import type { Producto } from '../../../entities/producto';
import type { InterUiListaProductos } from '../model/InterUiListaProductos';

const COLUMNAS: JTableColumn<Producto>[] = [
  { id: 'sku', header: 'SKU', cell: (p) => p.sku },
  { id: 'nombre', header: 'Nombre', cell: (p) => p.nombre },
  { id: 'precio', header: 'Precio', cell: (p) => `S/ ${p.precio.toFixed(2)}`, align: 'end' },
  { id: 'stock', header: 'Stock', cell: (p) => p.stock, align: 'end' },
];

export function UiListaProductosView({ productos, cargando, error, textoVacio, onBuscar, onEditar, onEliminar }: InterUiListaProductos) {
  return (
    <>
      <JSearchBox label="Buscar productos" placeholder="Nombre o SKU" onSearch={onBuscar} />
      {error && <JText tone="danger" role="alert">{error}</JText>}
      <JTable
        caption="Productos"
        columns={COLUMNAS}
        rows={productos}
        rowKey={(p) => p.id}
        busy={cargando}
        emptyMessage={textoVacio}
        actions={[
          { id: 'editar', label: 'Editar', accessibleLabel: (p) => `Editar ${p.nombre}`, onAction: (p) => onEditar(p.id) },
          { id: 'eliminar', label: 'Eliminar', accessibleLabel: (p) => `Eliminar ${p.nombre}`, onAction: onEliminar },
        ]}
      />
    </>
  );
}

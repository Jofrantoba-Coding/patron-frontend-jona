// Vista: el diálogo de confirmación genérico del sistema de diseño, con los textos del producto.
import { JConfirmDialog } from '@jona-libro/ds-atomico';
import type { InterUiEliminarProducto } from '../model/InterUiEliminarProducto';

export function UiEliminarProductoView({ producto, ocupado, error, textoMensaje, textoConfirmar, onConfirmar, onCerrar }: InterUiEliminarProducto) {
  return (
    <JConfirmDialog
      open={producto !== undefined}
      title={`¿Eliminar ${producto?.nombre ?? ''}?`}
      message={error ?? textoMensaje}
      confirmLabel={textoConfirmar}
      busy={ocupado}
      onConfirm={onConfirmar}
      onCancel={onCerrar}
    />
  );
}

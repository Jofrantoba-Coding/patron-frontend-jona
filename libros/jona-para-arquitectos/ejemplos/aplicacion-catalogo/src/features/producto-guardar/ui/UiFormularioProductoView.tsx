// Vista: un organismo de dominio. Vive en la aplicación, no en el sistema de diseño, porque
// sabe qué es un producto; se compone con moléculas y átomos genéricos del sistema de diseño.
import { JButton, JField, JText } from '@jona-libro/ds-atomico';
import type { InterUiFormularioProducto } from '../model/InterUiFormularioProducto';

export function UiFormularioProductoView({
  borrador, errores, cargando, guardando, errorGeneral, textoGuardar, textoCancelar,
  onCambiar, onGuardar, onCancelar,
}: InterUiFormularioProducto) {
  if (cargando) return <JText tone="muted" role="status">Cargando producto…</JText>;
  return (
    <form
      aria-label="Producto"
      noValidate
      onSubmit={(evento) => {
        evento.preventDefault();
        onGuardar();
      }}
    >
      <JField label="SKU" hint="Tres letras, guion y tres dígitos: TEC-001" value={borrador.sku} error={errores.sku} required onChange={(v) => onCambiar('sku', v)} />
      <JField label="Nombre" value={borrador.nombre} error={errores.nombre} required onChange={(v) => onCambiar('nombre', v)} />
      <JField label="Precio (S/)" value={borrador.precio} error={errores.precio} required onChange={(v) => onCambiar('precio', v)} />
      <JField label="Stock" value={borrador.stock} error={errores.stock} required onChange={(v) => onCambiar('stock', v)} />
      {errorGeneral && <JText tone="danger" role="alert">{errorGeneral}</JText>}
      <JButton type="submit" disabled={guardando}>{textoGuardar}</JButton>
      <JButton variant="secondary" disabled={guardando} onClick={onCancelar}>{textoCancelar}</JButton>
    </form>
  );
}

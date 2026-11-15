import type { InterProductoRepositorio, Producto } from '../../../entities/producto';
import { UIELIMINARPRODUCTO_DEFAULTS } from '../model/InterUiEliminarProducto';
import { useUiEliminarProductoImpl } from '../model/UiEliminarProductoImpl';
import { UiEliminarProductoView } from './UiEliminarProductoView';

export interface UiEliminarProductoProps {
  repositorio: InterProductoRepositorio;
  /** El producto a eliminar; undefined, el diálogo está cerrado. */
  producto?: Producto;
  onEliminado: () => void;
  onCerrar: () => void;
}

/** Entrada (forma mínima, variante a). */
export function UiEliminarProducto({ repositorio, producto, onEliminado, onCerrar }: UiEliminarProductoProps) {
  const impl = useUiEliminarProductoImpl(repositorio, producto, onEliminado);
  return <UiEliminarProductoView {...UIELIMINARPRODUCTO_DEFAULTS} {...impl} producto={producto} onCerrar={onCerrar} />;
}

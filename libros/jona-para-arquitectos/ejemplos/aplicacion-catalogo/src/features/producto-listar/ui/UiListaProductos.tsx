import type { InterProductoRepositorio, Producto } from '../../../entities/producto';
import { UILISTAPRODUCTOS_DEFAULTS } from '../model/InterUiListaProductos';
import { useUiListaProductosImpl } from '../model/UiListaProductosImpl';
import { UiListaProductosView } from './UiListaProductosView';

export interface UiListaProductosProps {
  repositorio: InterProductoRepositorio;
  /** Cambiarlo vuelve a cargar la lista: lo usa quien sabe que algo cambió (el widget). */
  recarga?: number;
  onEditar: (id: string) => void;
  onEliminar: (producto: Producto) => void;
}

/** Entrada (forma mínima, variante a). */
export function UiListaProductos({ repositorio, recarga = 0, onEditar, onEliminar }: UiListaProductosProps) {
  const impl = useUiListaProductosImpl(repositorio, recarga);
  return <UiListaProductosView {...UILISTAPRODUCTOS_DEFAULTS} {...impl} onEditar={onEditar} onEliminar={onEliminar} />;
}

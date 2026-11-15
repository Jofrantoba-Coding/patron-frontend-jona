import type { InterProductoRepositorio } from '../../../entities/producto';
import { UiEliminarProducto } from '../../../features/producto-eliminar';
import { UiListaProductos } from '../../../features/producto-listar';
import { UICATALOGO_DEFAULTS } from '../model/InterUiCatalogo';
import { useUiCatalogoImpl } from '../model/UiCatalogoImpl';
import { UiCatalogoView } from './UiCatalogoView';

export interface UiCatalogoProps {
  repositorio: InterProductoRepositorio;
  onEditar: (id: string) => void;
}

/**
 * Entrada del widget (variante a): llena los huecos de la vista con las entradas de dos
 * funcionalidades y les pasa el mismo puerto. Es la salida de FSD al acoplamiento entre
 * slices de la misma capa: componerlos en una capa superior (capítulo 6, sección 6.3).
 */
export function UiCatalogo({ repositorio, onEditar }: UiCatalogoProps) {
  const impl = useUiCatalogoImpl();
  return (
    <UiCatalogoView
      {...UICATALOGO_DEFAULTS}
      lista={<UiListaProductos repositorio={repositorio} recarga={impl.recarga} onEditar={onEditar} onEliminar={impl.onPedirEliminar} />}
      dialogo={
        <UiEliminarProducto
          repositorio={repositorio}
          producto={impl.productoAEliminar}
          onEliminado={impl.onEliminado}
          onCerrar={impl.onCerrarDialogo}
        />
      }
    />
  );
}

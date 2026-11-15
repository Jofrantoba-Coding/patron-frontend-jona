import { JPageLayout } from '@jona-libro/ds-atomico';
import type { InterProductoRepositorio } from '../../../entities/producto';
import { UiFormularioProducto } from '../../../features/producto-guardar';

export interface ProductoPageProps {
  repositorio: InterProductoRepositorio;
  /** Sin id, alta; con id, modificación. */
  id?: string;
  onVolver: () => void;
}

export function ProductoPage({ repositorio, id, onVolver }: ProductoPageProps) {
  return (
    <JPageLayout title={id === undefined ? 'Nuevo producto' : 'Editar producto'}>
      <UiFormularioProducto repositorio={repositorio} id={id} onGuardado={onVolver} onCancelar={onVolver} />
    </JPageLayout>
  );
}

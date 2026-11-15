// Página (FSD) = página de Atomic Design: la disposición del sistema de diseño llena con el widget.
import { JButton, JPageLayout } from '@jona-libro/ds-atomico';
import type { InterProductoRepositorio } from '../../../entities/producto';
import { UiCatalogo } from '../../../widgets/catalogo';

export interface CatalogoPageProps {
  repositorio: InterProductoRepositorio;
  onNuevo: () => void;
  onEditar: (id: string) => void;
}

export function CatalogoPage({ repositorio, onNuevo, onEditar }: CatalogoPageProps) {
  return (
    <JPageLayout title="Productos" actions={<JButton onClick={onNuevo}>Nuevo producto</JButton>}>
      <UiCatalogo repositorio={repositorio} onEditar={onEditar} />
    </JPageLayout>
  );
}

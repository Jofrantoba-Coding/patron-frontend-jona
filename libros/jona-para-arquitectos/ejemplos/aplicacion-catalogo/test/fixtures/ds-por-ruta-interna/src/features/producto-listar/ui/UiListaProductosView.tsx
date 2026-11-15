// Violación: la vista importa la vista interna de un organismo, por una ruta que el paquete no publica.
import { JTableView } from '@jona-libro/ds-atomico/dist/organismos/jtable/JTableView.js';

export const UiListaProductosView = () => <JTableView caption="Productos" columns={[]} rows={[]} rowKey={String} />;

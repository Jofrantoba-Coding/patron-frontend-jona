// API pública de la unidad para el cliente (y para quien dibuja la entrada, también el servidor).
// No exporta la Implementación del servidor: esa sale por indexServidor.ts.
export { UiCatalogo, type UiCatalogoProps } from './UiCatalogo';
export type { InterServicioCatalogo, ResultadoEliminar } from './InterServicioCatalogo';
export { UICATALOGO_DEFAULTS, type DatosUiCatalogo, type FilaProductoUi } from './InterUiCatalogo';

// API pública de la unidad para el servidor: la Implementación del servidor. Un segundo punto de
// entrada, como el `exports['./server']` de un paquete, para que el cliente no la arrastre.
export { cargarUiCatalogo, eliminarProducto, type PeticionUiCatalogo } from './UiCatalogoImplServidor';

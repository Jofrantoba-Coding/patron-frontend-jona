// Violación de la regla 2: la cara de datos lleva una función. JSON.stringify la descarta en
// silencio y el cliente hidrata con un dato que el servidor sí tenía.
export interface FilaProductoUi {
  id: string;
  nombre: string;
  precio: number;
}

export interface DatosUiCatalogo {
  termino: string;
  productos: readonly FilaProductoUi[];
  formatearPrecio: (precio: number) => string;
}

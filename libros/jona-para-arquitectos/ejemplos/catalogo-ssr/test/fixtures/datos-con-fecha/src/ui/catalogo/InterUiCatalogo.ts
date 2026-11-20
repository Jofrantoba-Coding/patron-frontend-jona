// Violación de la regla 2: una instancia en la cara de datos. Date viaja como texto y llega como
// string: el tipo dice Date y el cliente recibe otra cosa.
export interface FilaProductoUi {
  id: string;
  nombre: string;
  actualizado: Date;
}

export interface DatosUiCatalogo {
  termino: string;
  productos: readonly FilaProductoUi[];
}

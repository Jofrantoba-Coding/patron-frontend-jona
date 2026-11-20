// Violación de la regla 2: una fecha en la cara de datos. JSON la convierte en texto, y la vista
// hidrataría con un tipo distinto del que dibujó el servidor.
export interface DatosUiProducto {
  sku: string;
  nombre: string;
  actualizado: Date;
}

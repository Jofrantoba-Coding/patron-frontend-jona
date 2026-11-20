// Puerto hacia el backend inventario: unidades en existencia por SKU, nada más.

export interface Existencia {
  sku: string;
  unidades: number;
}

/** Errores como ErrorBackend: `no-encontrado` si el SKU no tiene registro, `no-disponible` para lo demás. */
export interface InterInventario {
  /** Las existencias de esos SKU, en una sola llamada. Un SKU sin registro no aparece. */
  consultar(skus: readonly string[]): Promise<Existencia[]>;
  /** Crea o reemplaza el registro del SKU. */
  fijar(sku: string, unidades: number): Promise<Existencia>;
  eliminar(sku: string): Promise<void>;
}

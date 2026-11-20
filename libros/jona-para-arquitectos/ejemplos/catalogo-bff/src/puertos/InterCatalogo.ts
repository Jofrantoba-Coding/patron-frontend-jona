// Puerto hacia el backend catalogo, en el idioma de ese servicio: artículos, títulos y céntimos.
// El adaptador traduce el transporte (rutas, sobres, códigos de estado); los manejadores traducen
// el modelo de catalogo al de la SPA.

export interface Articulo {
  codigoArticulo: string;
  sku: string;
  titulo: string;
  /** Entero: catalogo guarda los importes en céntimos. */
  precioCentimos: number;
}

export type DatosArticulo = Omit<Articulo, 'codigoArticulo'>;

/**
 * Errores como ErrorBackend: `conflicto` cuando catalogo rechaza el SKU (la regla es suya),
 * `no-encontrado` si el código no existe, `no-disponible` para lo demás.
 */
export interface InterCatalogo {
  /** Artículos cuyo título o SKU contienen el texto, sin distinguir mayúsculas, ordenados por SKU. */
  buscar(texto: string): Promise<Articulo[]>;
  /** undefined si no existe. */
  obtener(codigo: string): Promise<Articulo | undefined>;
  crear(datos: DatosArticulo): Promise<Articulo>;
  actualizar(codigo: string, datos: DatosArticulo): Promise<Articulo>;
  eliminar(codigo: string): Promise<void>;
}

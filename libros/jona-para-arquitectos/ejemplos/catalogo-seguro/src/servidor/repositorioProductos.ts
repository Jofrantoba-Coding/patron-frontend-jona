// El backend de productos, en memoria. Hace de base de datos: lo que guarda llega tal cual al
// navegador, así que el ejemplo guarda también lo que guardaría un atacante.
import type { Producto } from '../dominio/Producto';

export interface InterRepositorioProductos {
  listar(): Promise<Producto[]>;
  /** false si no existía. */
  eliminar(id: string): Promise<boolean>;
}

export const PRODUCTOS_DE_EJEMPLO: readonly Producto[] = [
  { id: 'p-1', sku: 'TEC-001', nombre: 'Teclado mecánico', precio: 120, descripcion: 'Switches táctiles, distribución en español.', enlaceFabricante: 'https://fabricante.example/teclados' },
  { id: 'p-2', sku: 'MOU-002', nombre: 'Mouse inalámbrico', precio: 45.5, descripcion: 'Batería para 18 meses.' },
  // Datos hostiles, a propósito: un nombre con HTML, una descripción con un script y un enlace
  // javascript:. La vista los muestra como texto, y la Implementación descarta el enlace.
  {
    id: 'p-3',
    sku: 'MON-003',
    nombre: 'Monitor <img src=x onerror="alert(1)">',
    precio: 699,
    descripcion: '</script><script>alert(document.cookie)</script>',
    enlaceFabricante: 'javascript:alert(document.cookie)',
  },
];

export function crearRepositorioProductos(iniciales: readonly Producto[]): InterRepositorioProductos {
  const productos = new Map(iniciales.map((p) => [p.id, { ...p }]));
  return {
    listar: async () => [...productos.values()].map((p) => ({ ...p })),
    eliminar: async (id) => productos.delete(id),
  };
}

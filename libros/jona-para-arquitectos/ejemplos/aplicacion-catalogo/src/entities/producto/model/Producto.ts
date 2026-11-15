// Dominio: el producto y sus reglas. Funciones puras: sin React, sin red, sin paquetes.
// Es el centro del hexágono; todo lo demás depende de esto y esto no depende de nada.

export interface Producto {
  id: string;
  /** Código único del producto: tres letras, guion y tres dígitos (TEC-001). */
  sku: string;
  nombre: string;
  /** Precio en soles, con dos decimales como máximo. */
  precio: number;
  stock: number;
}

/** Un producto sin identificador: lo que se crea o se actualiza. */
export type DatosProducto = Omit<Producto, 'id'>;

/** Lo que escribe el usuario: siempre texto, todavía sin validar. */
export interface BorradorProducto {
  sku: string;
  nombre: string;
  precio: string;
  stock: string;
}

export type CampoProducto = keyof BorradorProducto;

/** Un mensaje por campo que no cumple su regla. */
export type ErroresProducto = Partial<Record<CampoProducto, string>>;

export type Validacion = { ok: true; datos: DatosProducto } | { ok: false; errores: ErroresProducto };

export const BORRADOR_VACIO: BorradorProducto = { sku: '', nombre: '', precio: '', stock: '' };

const SKU = /^[A-Z]{3}-\d{3}$/;
const DECIMAL = /^\d+(\.\d+)?$/;

/** Las reglas del producto. El formulario las muestra; ningún adaptador las repite. */
export function validarProducto(borrador: BorradorProducto): Validacion {
  const errores: ErroresProducto = {};
  const sku = borrador.sku.trim().toUpperCase();
  const nombre = borrador.nombre.trim().replace(/\s+/g, ' ');
  const precioTexto = borrador.precio.trim().replace(',', '.');
  const stockTexto = borrador.stock.trim();

  if (!SKU.test(sku)) errores.sku = 'Use el formato AAA-000';
  if (nombre.length < 3 || nombre.length > 60) errores.nombre = 'Entre 3 y 60 caracteres';
  if (!DECIMAL.test(precioTexto) || Number(precioTexto) <= 0) errores.precio = 'Debe ser un número mayor que cero';
  else if ((precioTexto.split('.')[1] ?? '').length > 2) errores.precio = 'Como máximo dos decimales';
  if (!/^\d+$/.test(stockTexto)) errores.stock = 'Debe ser un entero mayor o igual a cero';

  if (Object.keys(errores).length > 0) return { ok: false, errores };
  return { ok: true, datos: { sku, nombre, precio: Number(precioTexto), stock: Number(stockTexto) } };
}

/** El borrador con el que se edita un producto existente. */
export function borradorDe(producto: Producto): BorradorProducto {
  return {
    sku: producto.sku,
    nombre: producto.nombre,
    precio: producto.precio.toFixed(2),
    stock: String(producto.stock),
  };
}

/** Si un producto coincide con el término de búsqueda: por nombre o por SKU, sin distinguir mayúsculas. */
export function coincide(producto: Producto, termino: string): boolean {
  const t = termino.trim().toLowerCase();
  return t === '' || producto.nombre.toLowerCase().includes(t) || producto.sku.toLowerCase().includes(t);
}

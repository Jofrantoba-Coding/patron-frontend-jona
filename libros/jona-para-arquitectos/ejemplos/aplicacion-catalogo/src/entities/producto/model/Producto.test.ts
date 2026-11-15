// @vitest-environment node
// El dominio se prueba sin React, sin DOM y sin dobles: son funciones puras.
import { describe, expect, it } from 'vitest';
import { borradorDe, coincide, validarProducto, type BorradorProducto } from './Producto';

const VALIDO: BorradorProducto = { sku: 'tec-001', nombre: '  Teclado   mecánico ', precio: '120,5', stock: '8' };

describe('validarProducto', () => {
  it('normaliza un borrador válido: SKU en mayúsculas, espacios y coma decimal', () => {
    expect(validarProducto(VALIDO)).toEqual({
      ok: true,
      datos: { sku: 'TEC-001', nombre: 'Teclado mecánico', precio: 120.5, stock: 8 },
    });
  });

  it('informa un mensaje por cada campo que no cumple su regla', () => {
    expect(validarProducto({ sku: 'TEC1', nombre: 'Te', precio: '0', stock: '-1' })).toEqual({
      ok: false,
      errores: {
        sku: 'Use el formato AAA-000',
        nombre: 'Entre 3 y 60 caracteres',
        precio: 'Debe ser un número mayor que cero',
        stock: 'Debe ser un entero mayor o igual a cero',
      },
    });
  });

  it.each([
    ['12.345', 'Como máximo dos decimales'],
    ['abc', 'Debe ser un número mayor que cero'],
    ['', 'Debe ser un número mayor que cero'],
  ])('precio %j: %s', (precio, mensaje) => {
    expect(validarProducto({ ...VALIDO, precio })).toEqual({ ok: false, errores: { precio: mensaje } });
  });

  it('el stock no admite decimales', () => {
    expect(validarProducto({ ...VALIDO, stock: '2.5' })).toMatchObject({ ok: false, errores: { stock: expect.any(String) } });
  });
});

describe('borradorDe y coincide', () => {
  it('el borrador de un producto vuelve a validar al mismo producto', () => {
    const producto = { id: 'p-1', sku: 'MOU-002', nombre: 'Mouse', precio: 45.5, stock: 20 };

    expect(borradorDe(producto)).toEqual({ sku: 'MOU-002', nombre: 'Mouse', precio: '45.50', stock: '20' });
    expect(validarProducto(borradorDe(producto))).toEqual({ ok: true, datos: { sku: 'MOU-002', nombre: 'Mouse', precio: 45.5, stock: 20 } });
  });

  it('coincide por nombre o por SKU, sin distinguir mayúsculas; el término vacío coincide con todo', () => {
    const producto = { id: 'p-1', sku: 'MOU-002', nombre: 'Mouse', precio: 45.5, stock: 20 };

    expect([coincide(producto, 'mou'), coincide(producto, '002'), coincide(producto, ' '), coincide(producto, 'tec')]).toEqual([true, true, true, false]);
  });
});

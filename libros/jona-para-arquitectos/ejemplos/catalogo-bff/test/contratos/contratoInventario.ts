// Suite de contrato del consumidor para inventario: lo que el BFF necesita de ese servicio.
import { beforeEach, describe, expect, it } from 'vitest';
import type { InterInventario } from '../../src/puertos/InterInventario.js';
import { tipoDeError } from './contratoCatalogo.js';

/** `crear` entrega un inventario vacío para cada prueba. */
export function contratoInventario(nombre: string, crear: () => Promise<InterInventario> | InterInventario) {
  describe(`contrato de InterInventario: ${nombre}`, () => {
    let inventario: InterInventario;
    beforeEach(async () => {
      inventario = await crear();
    });

    it('fijar crea o reemplaza, y consultar devuelve solo los SKU pedidos que tienen registro', async () => {
      await inventario.fijar('TEC-001', 8);
      await inventario.fijar('MOU-002', 20);
      expect(await inventario.fijar('TEC-001', 5)).toEqual({ sku: 'TEC-001', unidades: 5 });

      expect(await inventario.consultar(['TEC-001', 'AUD-004'])).toEqual([{ sku: 'TEC-001', unidades: 5 }]);
    });

    it('consultar una lista vacía no falla y devuelve una lista vacía', async () => {
      expect(await inventario.consultar([])).toEqual([]);
    });

    it('eliminar quita el registro; eliminar uno que no existe es no-encontrado', async () => {
      await inventario.fijar('TEC-001', 8);

      await inventario.eliminar('TEC-001');

      expect(await inventario.consultar(['TEC-001'])).toEqual([]);
      expect(await tipoDeError(inventario.eliminar('TEC-001'))).toBe('no-encontrado');
    });

    it('un SKU con caracteres reservados en la URL viaja intacto', async () => {
      await inventario.fijar('A/B 1', 3);

      expect(await inventario.consultar(['A/B 1'])).toEqual([{ sku: 'A/B 1', unidades: 3 }]);
    });
  });
}

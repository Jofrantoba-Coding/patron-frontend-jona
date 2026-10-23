import { describe, expect, it } from 'vitest';
import { listEmpresas, listPuntosVenta } from './auth.js';
import { createStore } from './store.js';
import { tinySeed } from './test-helpers.js';

/**
 * S-MOCK-34 / S-REG-15: the Wave 2 `empresa` and `punto-venta` entries write the W1 storage sections, so the W1
 * lookups keep their item shape (`{id,name}`, `{id,name,id_empresa}`) and show only the active rows (R-REG-12).
 */
const seed = () => ({
  ...tinySeed(),
  empresas: {
    a: [
      { id: '1', name: 'EMPRESA UNO', ruc: '20123456789', direccion: 'AV. UNO', flag_percepcion: false, id_usuario: 7 },
      { id: '2', name: 'EMPRESA CERRADA', activo: false },
    ],
    b: [],
  },
  puntosVenta: {
    a: [
      { id: '1', name: 'TIENDA', id_empresa: '1', id_localidad: '3', direccion: 'AV. UNO', telefono: '555', id_ubigeo: '150101', id_usuario: 7, activo: true },
      { id: '2', name: 'CERRADA', id_empresa: '1', activo: false },
      { id: '3', name: 'OTRA', id_empresa: '2', estado: 'A' },
    ],
    b: [],
  },
});
const store = () => createStore(seed());

describe('W1 lookups over the shared sections', () => {
  it('lists empresas as {id,name}, in that key order, without the Wave 2 fields', () => {
    expect(JSON.stringify(listEmpresas(store(), 'a'))).toBe('{"items":[{"id":"1","name":"EMPRESA UNO"}]}');
  });

  it('lists puntos de venta as {id,name,id_empresa}, active only, filtered by empresa', () => {
    expect(JSON.stringify(listPuntosVenta(store(), 'a'))).toBe('{"items":[{"id":"1","name":"TIENDA","id_empresa":"1"},{"id":"3","name":"OTRA","id_empresa":"2"}]}');
    expect(JSON.stringify(listPuntosVenta(store(), 'a', { id_empresa: '1' }))).toBe('{"items":[{"id":"1","name":"TIENDA","id_empresa":"1"}]}');
  });
});

import { validateRegistry } from '../registry/schema.js';
import { parentEntry } from './children.fixture';
import { tinySeed } from './test-helpers';

/**
 * Test-only registry for the W3-4b child rules: `items` (almacenes unique among active siblings, removal deactivate) and `vendedores`
 * (activaciones with removal none, cascade).
 */
const text = (name: string, extra: Record<string, any> = {}) => ({ name, kind: 'text', label: name, max: 30, ...extra });

export const RULES_REGISTRY = validateRegistry([
  parentEntry('items', {
    children: {
      almacenes: {
        tab: 'Almacenes', removal: 'deactivate', entry: 'dialog',
        fields: [text('almacen', { required: true }), text('proceso', { required: true })],
        columns: [{ key: 'almacen', header: 'Almacen' }],
        unique: [{ fields: ['almacen', 'proceso'], errorField: 'almacen', message: 'Almacen ya se Encuentra Activado' }],
      },
    },
  }),
  parentEntry('vendedores', {
    children: {
      activaciones: { tab: 'Activacion', removal: 'none', fields: [text('motivo')], columns: [{ key: 'motivo', header: 'Motivo' }] },
      notas: { tab: 'Notas', removal: 'delete', fields: [text('nota')], columns: [{ key: 'nota', header: 'Nota' }] },
    },
  }),
]);

export const RULES_SEED = {
  ...tinySeed(),
  items: {
    a: [
      {
        id_items: '001', nombre: 'ITEM', activo: true,
        almacenes: [{ id: '1', almacen: 'A', proceso: 'VENTA', estado: 'A' }, { id: '2', almacen: 'B', proceso: 'VENTA', estado: 'D' }, { id: '3', almacen: 'C', proceso: 'VENTA', estado: 'A' }],
      },
      { id_items: '002', nombre: 'OTRO', activo: true, almacenes: [{ id: '4', almacen: 'A', proceso: 'VENTA', estado: 'A' }] },
    ],
  },
  vendedores: {
    a: [{ id_vendedores: '001', nombre: 'VEN', activo: true, activaciones: [{ id: '1', motivo: 'UNO', estado: 'A' }, { id: '2', motivo: 'DOS', estado: 'D' }], notas: [{ id: '1', nota: 'N1' }] }, { id_vendedores: '002', nombre: 'LIBRE', activo: true }],
  },
};

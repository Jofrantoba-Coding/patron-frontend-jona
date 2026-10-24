import { validateRegistry } from '../registry/schema.js';
import { parentEntry } from './children.fixture';
import { tinySeed } from './test-helpers';

/**
 * Test-only registry for the W3-4b child rules: `items` (almacenes unique among active siblings, removal deactivate), `vendedores`
 * (activaciones with removal none, cascade), `transportistas` (vehiculos, a store child of the `vehiculos` entry) and `usuarios` (series, a store
 * child over a shared section).
 */
const text = (name: string, extra: Record<string, any> = {}) => ({ name, kind: 'text', label: name, max: 30, ...extra });

/** An entry that owns the rows of a store child: a `placa` and the key that links its rows to the parent. */
const owner = (slug: string, key: string, over: Record<string, any> = {}) => ({
  slug, idKey: `id_${slug}`, codeWidth: 3, entity: 'un registro', scope: 'tenant', seed: slug, messages: { style: 'M1' },
  fields: [{ name: `id_${slug}`, kind: 'code', label: 'Codigo' }, text('placa', { required: true }), text(key)],
  columns: [{ key: 'placa', header: 'Placa' }],
  ...over,
});

export const RULES_ENTRIES: Record<string, any>[] = [
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
  owner('vehiculos', 'id_transportistas'),
  parentEntry('transportistas', { children: { vehiculos: { tab: 'Vehiculos', removal: 'delete', store: { entry: 'vehiculos', key: 'id_transportistas' } } } }),
  owner('series', 'id_usuarios', { scope: 'shared' }),
  parentEntry('usuarios', { children: { series: { tab: 'Series', removal: 'delete', store: { entry: 'series', key: 'id_usuarios' } } } }),
];

export const RULES_REGISTRY = validateRegistry(RULES_ENTRIES);

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
  transportistas: { a: [{ id_transportistas: '001', nombre: 'TRA', activo: true }, { id_transportistas: '002', nombre: 'OTRA', activo: true }] },
  vehiculos: {
    a: [
      { id_vehiculos: '001', placa: 'AAA111', id_transportistas: '001', activo: true },
      { id_vehiculos: '002', placa: 'BBB222', id_transportistas: '002', activo: true },
      { id_vehiculos: '003', placa: 'CCC333', id_transportistas: '001', activo: true },
    ],
  },
  usuarios: { a: [{ id_usuarios: '001', nombre: 'USU', activo: true }] },
  series: [{ id_series: '001', placa: 'S1', id_usuarios: '001', activo: true }, { id_series: '002', placa: 'S2', id_usuarios: '002', activo: true }],
};

/** `clientes` with children gated by company parameters (R-REG-17): sustitutos by a flag, avisos by a flag value. */
export const GATE_ENTRIES: Record<string, any>[] = [
  parentEntry('clientes', {
    children: {
      sustitutos: { tab: 'Sustitutos', removal: 'delete', gate: { param: 'IS_CLIENTE_SUSTITUTO' }, fields: [text('nombre', { required: true })], columns: [{ key: 'nombre', header: 'Nombre' }] },
      avisos: { tab: 'Avisos', removal: 'delete', gate: { param: 'ISBOTICA', in: [false] }, fields: [text('aviso')], columns: [{ key: 'aviso', header: 'Aviso' }] },
    },
  }),
];

export const GATE_REGISTRY = validateRegistry(GATE_ENTRIES);

export const GATE_SEED = {
  ...tinySeed(),
  params: { a: { INICIO_ACTIVIDADES: '2020-01-01', IS_CLIENTE_SUSTITUTO: true, ISBOTICA: false }, b: { INICIO_ACTIVIDADES: '2021-06-01', IS_CLIENTE_SUSTITUTO: false, ISBOTICA: true } },
  clientes: { a: [{ id_clientes: '001', nombre: 'ACME', activo: true }], b: [{ id_clientes: '001', nombre: 'ACME', activo: true }] },
};

import { validateRegistry } from '../registry/schema.js';
import { tinySeed } from './test-helpers';

/** Test-only parents with children (W3-4a): `clientes` (tenant) and `cuentas` (empresa scope). */
const text = (name: string, extra: Record<string, any> = {}) => ({ name, kind: 'text', label: name, max: 30, ...extra });
export const parentEntry = (slug: string, over: Record<string, any> = {}): Record<string, any> => ({
  slug, idKey: `id_${slug}`, codeWidth: 3, entity: 'un cliente', scope: 'tenant', seed: slug, messages: { style: 'M1' },
  fields: [{ name: `id_${slug}`, kind: 'code', label: 'Codigo' }, text('nombre', { required: true })],
  columns: [{ key: 'nombre', header: 'Nombre' }],
  children: {
    direcciones: {
      tab: 'Direcciones', removal: 'deactivate', entry: 'dialog',
      fields: [text('direccion', { required: true, max: 40 }), text('distrito', { max: 20 })],
      columns: [{ key: 'direccion', header: 'Direccion' }],
    },
    contactos: { tab: 'Contactos', removal: 'delete', fields: [text('nombre', { required: true, max: 20 })], columns: [{ key: 'nombre', header: 'Nombre' }] },
  },
  ...over,
});

export const CHILD_REGISTRY = validateRegistry([
  parentEntry('clientes'),
  parentEntry('cuentas', { scope: 'empresa', stamp: ['id_empresa'] }),
]);

export const CHILD_SEED = {
  ...tinySeed(),
  empresas: { a: [{ id: '1', name: 'Empresa 1' }, { id: '2', name: 'Empresa 2' }], b: [{ id: '3', name: 'Empresa 3' }] },
  clientes: {
    a: [
      { id_clientes: '001', nombre: 'ACME', activo: true, direcciones: [{ id: '1', direccion: 'AV 1', estado: 'A' }, { id: '2', direccion: 'AV 2', estado: 'D' }, { id: '3', direccion: 'AV 3', estado: 'A', activo: false }], contactos: [{ id: '1', nombre: 'ANA' }] },
      { id_clientes: '002', nombre: 'BETA', activo: true },
      { id_clientes: '003', nombre: 'GONE', activo: false, contactos: [{ id: '2', nombre: 'LUIS' }] },
    ],
    b: [{ id_clientes: '001', nombre: 'OTRO TENANT', activo: true }],
  },
  cuentas: { a: [{ id_cuentas: '001', nombre: 'E1', id_empresa: '1', activo: true, contactos: [{ id: '1', nombre: 'UNO' }] }, { id_cuentas: '002', nombre: 'E2', id_empresa: '2', activo: true }] },
};

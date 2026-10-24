import { afterEach, describe, expect, it } from 'vitest';
import { validateRegistry } from '../registry/schema.js';
import { createRecord, getRecord, updateRecord } from './catalog.js';
import { createStore } from './store.js';
import { tinySeed } from './test-helpers';

/**
 * S-REG-25 field half (R-REG-17): a field gated by a company parameter that is off is absent for the server: a body value is ignored (stored nowhere), the field is
 * neither required nor validated and gets no default. Tenant `a` has the parameter on, tenant `b` off.
 */
const text = (name: string, extra: Record<string, any> = {}) => ({ name, kind: 'text', label: name, max: 30, ...extra });
const GATE = { param: 'IS_CLIENTE_CONDICION_PAGO' };
const REGISTRY = validateRegistry([
  {
    slug: 'clientes', idKey: 'id_clientes', codeWidth: 3, entity: 'un cliente', scope: 'tenant', seed: 'clientes', messages: { style: 'M1' },
    fields: [
      { name: 'id_clientes', kind: 'code', label: 'Codigo' }, text('nombre', { required: true }),
      text('condicion', { gate: GATE, required: true, normalize: ['upper'], message: 'Seleccione condicion' }),
      { name: 'dias', kind: 'number', label: 'Dias', scale: 0, max: 3, gate: GATE, default: '7' },
    ],
    columns: [{ key: 'nombre', header: 'Nombre' }],
    validation: ['nombre', 'condicion', 'dias'],
  },
]);
const SEED = {
  ...tinySeed(),
  params: { a: { INICIO_ACTIVIDADES: '2020-01-01', IS_CLIENTE_CONDICION_PAGO: true }, b: { INICIO_ACTIVIDADES: '2021-06-01', IS_CLIENTE_CONDICION_PAGO: false } },
  clientes: { a: [{ id_clientes: '001', nombre: 'ACME', condicion: 'CONTADO', dias: 0, activo: true }], b: [{ id_clientes: '001', nombre: 'ACME', activo: true }] },
};
const store = createStore(SEED, REGISTRY);
afterEach(() => store.reset());
const fails = (run: () => unknown) => { try { run(); } catch (e: any) { return [e.status, e.code, e.details?.map((d: any) => d.field)]; } throw new Error('expected a failure'); };

describe('S-REG-25 a gated-off field (R-REG-17)', () => {
  it('is not required: the create passes with the parameter off and fails with it on', () => {
    expect(createRecord(store, 'b', 'clientes', { nombre: 'NUEVO' }, {})).toMatchObject({ nombre: 'NUEVO' });
    expect(fails(() => createRecord(store, 'a', 'clientes', { nombre: 'NUEVO' }, {}))).toEqual([422, 'VALIDATION_ERROR', ['condicion']]);
  });

  it('ignores a body value: nothing is stored, and a body value that would be invalid is not validated', () => {
    const created: any = createRecord(store, 'b', 'clientes', { nombre: 'NUEVO', condicion: 'credito', dias: 'abc' }, {});
    expect([created.condicion, created.dias]).toEqual([undefined, undefined]);
    const updated: any = updateRecord(store, 'b', 'clientes', '001', { nombre: 'ACME 2', condicion: 'credito', dias: '9' }, {});
    expect([updated.nombre, updated.condicion, updated.dias]).toEqual(['ACME 2', undefined, undefined]);
  });

  it('gets no default (the default applies only with the parameter on)', () => {
    expect((createRecord(store, 'b', 'clientes', { nombre: 'N' }, {}) as any).dias).toBeUndefined();
    expect((createRecord(store, 'a', 'clientes', { nombre: 'N', condicion: 'contado' }, {}) as any).dias).toBe(7);
  });

  it('with the parameter on the field works: normalized, stored and read back', () => {
    createRecord(store, 'a', 'clientes', { nombre: 'N', condicion: 'credito', dias: '30' }, {});
    expect(getRecord(store, 'a', 'clientes', '002', {})).toMatchObject({ condicion: 'CREDITO', dias: '30' });
  });

  it('keeps a value stored while the parameter was on: an update with the parameter off leaves it alone', () => {
    const own = createStore({ ...SEED, clientes: { ...SEED.clientes, b: [{ id_clientes: '001', nombre: 'ACME', condicion: 'CREDITO', activo: true }] } }, REGISTRY);
    const updated: any = updateRecord(own, 'b', 'clientes', '001', { nombre: 'ACME 3', condicion: 'CONTADO' }, {});
    expect([updated.nombre, updated.condicion]).toEqual(['ACME 3', 'CREDITO']);
  });
});

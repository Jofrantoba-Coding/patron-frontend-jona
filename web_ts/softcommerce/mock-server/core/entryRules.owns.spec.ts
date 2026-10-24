import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { validateRegistry } from '../registry/schema.js';
import { createRecord, getRecord, updateRecord } from './catalog.js';
import { registerEntryRule } from './entryRules.js';
import { createStore } from './store.js';
import { tinySeed } from './test-helpers';

/**
 * S-ACT-8 / R-ACT-5: a field a named rule OWNS (the `estado` an activation history drives) is derived by the rule, never read from a body. The rule here is a
 * test rule: `estado` is `I` while `cerrado` is `S`, else `A`. The real `activacion` rule (W3-7) claims `estado` the same way.
 */
const text = (name: string, extra: Record<string, any> = {}) => ({ name, kind: 'text', label: name, max: 5, ...extra });
const entry = {
  slug: 'cuentas', idKey: 'id_cuentas', codeWidth: 3, entity: 'una cuenta', scope: 'tenant', seed: 'cuentas', messages: { style: 'M1' },
  fields: [{ name: 'id_cuentas', kind: 'code', label: 'Codigo' }, text('nombre', { required: true }), text('cerrado'), text('estado')],
  columns: [{ key: 'nombre', header: 'Nombre' }], rules: [{ name: 'demoEstado' }],
};

// `libros` owns `estado` too, but its rule derives nothing from the record (the activation history is not on it): the stored value must survive any body.
const owned = { ...entry, slug: 'libros', idKey: 'id_libros', seed: 'libros', fields: entry.fields.map((f) => (f.name === 'id_cuentas' ? { ...f, name: 'id_libros' } : f)), rules: [{ name: 'demoOwned' }] };

let unregister: () => void;
let store: ReturnType<typeof createStore>;
beforeAll(() => {
  const removers = [
    registerEntryRule('demoEstado', { owns: () => ['estado'], derive: (values: any) => ({ estado: values.cerrado === 'S' ? 'I' : 'A' }) }),
    registerEntryRule('demoOwned', { owns: () => ['estado'] }),
  ];
  unregister = () => removers.forEach((remove) => remove());
  store = createStore(
    { ...tinySeed(), cuentas: { a: [{ id_cuentas: '001', nombre: 'UNO', cerrado: 'N', estado: 'A', activo: true }] }, libros: { a: [{ id_libros: '001', nombre: 'UNO', estado: 'A', activo: true }] } },
    validateRegistry([entry, owned]),
  );
});
afterAll(() => unregister());
afterEach(() => store.reset());

describe('S-ACT-8 estado is not writable', () => {
  it('a PUT carrying estado keeps the derived one: the body value is ignored', () => {
    expect(updateRecord(store, 'a', 'cuentas', '001', { nombre: 'UNO', estado: 'I' }, {})).toMatchObject({ estado: 'A' });
    expect(updateRecord(store, 'a', 'cuentas', '001', { cerrado: 'S', estado: 'A' }, {})).toMatchObject({ cerrado: 'S', estado: 'I' });
    expect(getRecord(store, 'a', 'cuentas', '001', {})).toMatchObject({ estado: 'I' });
  });

  it('a POST carrying estado gets the derived one', () => {
    expect(createRecord(store, 'a', 'cuentas', { nombre: 'DOS', estado: 'I' }, {})).toMatchObject({ estado: 'A' });
    expect(createRecord(store, 'a', 'cuentas', { nombre: 'TRES', cerrado: 'S', estado: 'A' }, {})).toMatchObject({ estado: 'I' });
  });

  it('a field the rule owns but does not derive keeps its stored value on a PUT and is never taken from a POST body', () => {
    expect(updateRecord(store, 'a', 'libros', '001', { nombre: 'UNO B', estado: 'I' }, {})).toMatchObject({ nombre: 'UNO B', estado: 'A' });
    expect(createRecord(store, 'a', 'libros', { nombre: 'DOS', estado: 'I' }, {}).estado).toBeUndefined();
  });

  it('an unknown rule is a load error until it is registered, and a field no rule owns stays writable', () => {
    expect(() => validateRegistry([{ ...entry, rules: [{ name: 'nadie' }] }])).toThrow(/unknown rule "nadie"/);
    expect(updateRecord(store, 'a', 'cuentas', '001', { nombre: 'OTRO' }, {})).toMatchObject({ nombre: 'OTRO' });
  });
});

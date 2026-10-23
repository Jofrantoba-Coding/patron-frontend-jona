import { describe, expect, it } from 'vitest';
import { validateRegistry } from '../registry/schema.js';
import { createRecord } from './catalog.js';
import type { MockError } from './errors.js';
import { minLengthOf } from './predicates.js';
import { createStore } from './store.js';
import { tinySeed } from './test-helpers.js';

/**
 * Test-only entry (R-REG-4, R-REF-5 empresa): `ruc` is an exact length (`minLen` 11 + `max` 11, the desktop `IntegerDocument(11)` and
 * `length != 11` check), `doc` takes its minimum from `tipo` (`minLenWhen`: the length depends on another field).
 */
const ENTRY = {
  slug: 'cosas', idKey: 'id_cosa', codeWidth: 0, entity: 'una Empresa', scope: 'tenant', seed: 'cosas', messages: { style: 'M1' },
  fields: [
    { name: 'ruc', kind: 'text', label: 'RUC', required: true, max: 11, minLen: 11, normalize: ['digits'] },
    { name: 'tipo', kind: 'options', label: 'Tipo', display: 'select', options: [{ value: 'D', label: 'DNI' }, { value: 'R', label: 'RUC' }, { value: 'O', label: 'Otro' }] },
    {
      name: 'doc', kind: 'text', label: 'Documento', max: 11, messages: { minLen: 'El documento {modo} es muy corto.' },
      minLenWhen: [{ when: { field: 'tipo', in: ['D'] }, len: 8 }, { when: { field: 'tipo', in: ['R'] }, len: 11 }],
    },
  ],
  columns: [{ key: 'ruc', header: 'RUC' }],
};
const store = () => createStore({ ...tinySeed(), cosas: { a: [] } }, validateRegistry([ENTRY]));
const caught = (fn: () => unknown): MockError => {
  try { fn(); } catch (e) { return e as MockError; }
  throw new Error('expected function to throw');
};
const create = (body: Record<string, any>) => createRecord(store(), 'a', 'cosas', { ruc: '20123456789', ...body });
const bad = (body: Record<string, any>) => caught(() => create(body)).details.map((d) => [d.field, d.code, d.message]);

describe('R-REG-4 minLen: a plain exact length (S-REF-10)', () => {
  it('accepts exactly 11 digits', () => {
    expect(create({})).toMatchObject({ ruc: '20123456789' });
  });

  it.each(['2012345678', '2', '201234567890'])('rejects %s: it is neither 11 digits nor within max', (ruc) => {
    expect(bad({ ruc })[0][0]).toBe('ruc');
  });

  it('a 10-digit value is a 422 MIN_LENGTH worded like a missing value (the desktop RUC text)', () => {
    expect(bad({ ruc: '2012345678' })).toEqual([['ruc', 'MIN_LENGTH', 'Para agregar una Empresa, debes especificar su RUC.']]);
  });

  it('letters are dropped by the digits step before the length is judged', () => {
    expect(bad({ ruc: 'abcdefghijk' })).toEqual([['ruc', 'REQUIRED', 'Para agregar una Empresa, debes especificar su RUC.']]);
    expect(create({ ruc: '2012-345-6789' })).toMatchObject({ ruc: '20123456789' });
  });
});

describe('R-REG-4 minLenWhen: the length depends on another field', () => {
  it('uses the length of the first matching rule', () => {
    expect(create({ tipo: 'D', doc: '12345678' })).toMatchObject({ doc: '12345678' });
    expect(create({ tipo: 'R', doc: '20123456789' })).toMatchObject({ doc: '20123456789' });
  });

  it('a value shorter than the chosen rule is a 422 with its own literal', () => {
    expect(bad({ tipo: 'D', doc: '1234567' })).toEqual([['doc', 'MIN_LENGTH', 'El documento agregar es muy corto.']]);
    expect(bad({ tipo: 'R', doc: '12345678' })).toEqual([['doc', 'MIN_LENGTH', 'El documento agregar es muy corto.']]);
  });

  it('no rule applies when none matches: any length is accepted', () => {
    expect(create({ tipo: 'O', doc: '1' })).toMatchObject({ doc: '1' });
    expect(create({ doc: '1' })).toMatchObject({ doc: '1' });
  });

  it('a blank optional value is not judged', () => {
    expect(create({ tipo: 'D', doc: '' })).toMatchObject({ doc: '' });
  });
});

describe('minLengthOf (shared by the client and both mocks)', () => {
  const field = ENTRY.fields[2];
  it.each([
    [{ tipo: 'D' }, 8],
    [{ tipo: 'R' }, 11],
    [{ tipo: 'O' }, undefined],
    [{}, undefined],
  ])('%j gives %s', (values, expected) => {
    expect(minLengthOf(field, values)).toBe(expected);
  });

  it('a plain minLen wins when no rule is declared', () => {
    expect(minLengthOf(ENTRY.fields[0], {})).toBe(11);
  });
});

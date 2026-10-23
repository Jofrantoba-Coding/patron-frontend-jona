import { describe, expect, it } from 'vitest';
import { validateRegistry } from '../../../mock-server/registry/schema.js';
import { toCatalogConfig } from '../../catalogs/registry';
import { validate } from './validate';

/** The client half of minLen / minLenWhen (R-REG-4, S-REF-10): the same shared rule and message as the server. */
const config = toCatalogConfig(
  validateRegistry([
    {
      slug: 'cosas', idKey: 'id_cosa', codeWidth: 0, entity: 'una Empresa', scope: 'tenant', seed: 'cosas', messages: { style: 'M1' },
      fields: [
        { name: 'ruc', kind: 'text', label: 'RUC', required: true, max: 11, minLen: 11, normalize: ['digits'] },
        { name: 'tipo', kind: 'options', label: 'Tipo', display: 'select', options: [{ value: 'D', label: 'DNI' }, { value: 'O', label: 'Otro' }] },
        { name: 'doc', kind: 'text', label: 'Documento', max: 11, minLenWhen: [{ when: { field: 'tipo', in: ['D'] }, len: 8 }] },
      ],
      columns: [{ key: 'ruc', header: 'RUC' }],
    },
  ]).entries[0],
);
const run = (values: Record<string, string>, mode: 'INSERT' | 'UPDATE' = 'UPDATE') =>
  validate(config.fields, { ruc: '20123456789', tipo: '', doc: '', ...values }, { entry: config.entry!, mode }).map((e) => [e.name, e.message]);

describe('validate minLen (S-REF-10)', () => {
  it('a 10-digit ruc says the desktop RUC text, worded for the mode', () => {
    expect(run({ ruc: '2012345678' })).toEqual([['ruc', 'Para modificar una Empresa, debes especificar su RUC.']]);
    expect(run({ ruc: '2012345678' }, 'INSERT')).toEqual([['ruc', 'Para agregar una Empresa, debes especificar su RUC.']]);
  });

  it('11 digits are accepted', () => {
    expect(run({})).toEqual([]);
  });

  it('a blank ruc is the same sentence (required first)', () => {
    expect(run({ ruc: '  ' })).toEqual([['ruc', 'Para modificar una Empresa, debes especificar su RUC.']]);
  });
});

describe('validate minLenWhen', () => {
  it('judges the value by the rule of the other field', () => {
    expect(run({ tipo: 'D', doc: '1234567' }).map(([name]) => name)).toEqual(['doc']);
    expect(run({ tipo: 'D', doc: '12345678' })).toEqual([]);
  });

  it('applies no length when no rule matches, and never to a blank optional value', () => {
    expect(run({ tipo: 'O', doc: '1' })).toEqual([]);
    expect(run({ tipo: 'D', doc: '' })).toEqual([]);
  });
});

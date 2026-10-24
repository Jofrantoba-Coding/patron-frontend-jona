import { describe, expect, it } from 'vitest';
import { parentEntry } from '../core/children.fixture';
import { validateRegistry } from './schema.js';

const text = (name: string) => ({ name, kind: 'text', label: name, max: 10 });
const fixture = (banco: Record<string, any>) => [
  { slug: 'bancos', idKey: 'id_bancos', codeWidth: 3, entity: 'un banco', scope: 'tenant', seed: 'bancos', messages: { style: 'M1' }, fields: [{ name: 'id_bancos', kind: 'code', label: 'C' }, { ...text('descripcion'), required: true }], columns: [{ key: 'descripcion', header: 'D' }] },
  parentEntry('clientes', { fields: [{ name: 'id_clientes', kind: 'code', label: 'C' }, text('nombre'), { name: 'id_banco', kind: 'select', label: 'Banco', source: { catalog: 'bancos' }, ...banco }, text('banco_nombre')] }),
];
const load = (banco: Record<string, any>) => () => validateRegistry(fixture(banco));

describe('R-REG-13 fillLabel: a select that copies its option name into another field (R-MST-11)', () => {
  it('accepts a target field and a list of option ids that leave it empty', () => {
    expect(load({ fillLabel: { target: 'banco_nombre', unless: ['58'] } })).not.toThrow();
    expect(load({ fillLabel: { target: 'banco_nombre' } })).not.toThrow();
  });

  it.each([
    ['an unknown target', { fillLabel: { target: 'nope' } }, /field "id_banco" fillLabel names unknown field "nope"/],
    ['no target', { fillLabel: {} }, /fillLabel needs a target field/],
    ['a bad unless', { fillLabel: { target: 'banco_nombre', unless: '58' } }, /fillLabel.unless must be a list of ids/],
    ['itself as the target', { fillLabel: { target: 'id_banco' } }, /fillLabel cannot target its own field/],
  ])('rejects %s, naming the entry and field', (_name, banco, message) => {
    expect(load(banco)).toThrow(message);
    expect(load(banco)).toThrow(/entry "clientes"/);
  });

  it('only a select can carry it', () => {
    const entries = fixture({});
    (entries[1] as any).fields[1] = { ...text('nombre'), fillLabel: { target: 'banco_nombre' } };
    expect(() => validateRegistry(entries)).toThrow(/fillLabel needs a select field/);
  });
});

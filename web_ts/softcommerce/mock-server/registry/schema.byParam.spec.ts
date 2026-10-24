import { describe, expect, it } from 'vitest';
import { parentEntry } from '../core/children.fixture';
import { validateRegistry } from './schema.js';

const text = (name: string) => ({ name, kind: 'text', label: name, max: 10 });
const load = (byParam: unknown, extra: Record<string, any> = {}) => () =>
  validateRegistry([parentEntry('clientes', { fields: [{ name: 'id_clientes', kind: 'code', label: 'C' }, text('nombre'), { ...text('zona'), byParam, ...extra }] })]);

describe('R-REG-17 byParam: a field that changes with a company parameter', () => {
  it('accepts a boolean params key with the overrides required and filter', () => {
    expect(load({ param: 'IS_DIRECCION_CLIENTE', in: [false], set: { required: true } })).not.toThrow();
  });

  it.each([
    ['a param that is not a params key', { param: 'NOPE', set: { required: true } }, /field "zona": gate.param "NOPE" is not a params key/],
    ['a value param', { param: 'PORC_IGV', set: { required: true } }, /gate.param "PORC_IGV" is a value, not a gate/],
    ['no overrides', { param: 'ISBOTICA' }, /byParam needs a non-empty set/],
    ['an empty set', { param: 'ISBOTICA', set: {} }, /byParam needs a non-empty set/],
    ['an override outside required and filter', { param: 'ISBOTICA', set: { max: 3 } }, /byParam.set names unknown key "max"/],
  ])('rejects %s, naming the entry and field', (_name, byParam, message) => {
    expect(load(byParam)).toThrow(message);
    expect(load(byParam)).toThrow(/entry "clientes"/);
  });
});

import { describe, expect, it } from 'vitest';
import { fieldState, matches } from './predicates.js';

const tipo = { field: 'tipo', in: ['TI', '01'] };

describe('matches ({ field, in })', () => {
  it.each<[string, any, Record<string, unknown>, boolean]>([
    ['no condition always matches', undefined, {}, true],
    ['value in the list', tipo, { tipo: 'TI' }, true],
    ['value outside the list', tipo, { tipo: '03' }, false],
    ['missing field is the empty string', tipo, {}, false],
    ['missing field matches a list holding the empty string', { field: 'tipo', in: [''] }, {}, true],
    ['null equals the empty string', { field: 'tipo', in: [''] }, { tipo: null }, true],
    ['null is not a listed value', tipo, { tipo: null }, false],
    ['numbers compare by their text', { field: 'n', in: ['1'] }, { n: 1 }, true],
    ['booleans compare by their text', { field: 'n', in: ['true'] }, { n: true }, true],
  ])('%s', (_name, cond, values, expected) => {
    expect(matches(cond, values)).toBe(expected);
  });
});

describe('fieldState (visibleWhen, enabledWhen, requiredWhen)', () => {
  const field = { name: 'nro', visibleWhen: tipo, requiredWhen: tipo };

  it('is visible, enabled and required while its conditions hold', () => {
    expect(fieldState(field, { tipo: 'TI' })).toEqual({ visible: true, enabled: true, required: true });
  });

  it('a hidden field is neither enabled nor required', () => {
    expect(fieldState(field, { tipo: '03' })).toEqual({ visible: false, enabled: false, required: false });
  });

  it('a disabled field is visible but never required', () => {
    const state = fieldState({ name: 'x', required: true, enabledWhen: tipo }, { tipo: '03' });
    expect(state).toEqual({ visible: true, enabled: false, required: false });
  });

  it('plain required stays required and a field without conditions is always active', () => {
    expect(fieldState({ name: 'x', required: true }, {})).toEqual({ visible: true, enabled: true, required: true });
    expect(fieldState({ name: 'x' }, {})).toEqual({ visible: true, enabled: true, required: false });
  });
});

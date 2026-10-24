import { describe, expect, it } from 'vitest';
import { gateOpen, paramToken, resolveParamToken } from './predicates.js';

const params = { IS_CLIENTE_SUSTITUTO: true, ISBOTICA: false, PORC_IGV: 18, MODO: 'B' };

describe('R-REG-17 gateOpen (shared by the server and the UI)', () => {
  it('no gate is always open', () => {
    expect(gateOpen(undefined, params)).toBe(true);
  });

  it('a plain gate is open when the param is true', () => {
    expect([gateOpen({ param: 'IS_CLIENTE_SUSTITUTO' }, params), gateOpen({ param: 'ISBOTICA' }, params), gateOpen({ param: 'MISSING' }, params)]).toEqual([true, false, false]);
  });

  it('a gate with `in` is open when the param equals one of the listed values (by text)', () => {
    expect([gateOpen({ param: 'MODO', in: ['A', 'B'] }, params), gateOpen({ param: 'MODO', in: ['A'] }, params), gateOpen({ param: 'ISBOTICA', in: [false] }, params)]).toEqual([true, false, true]);
  });

  it('a gate with `or` is open when the param or any of the other params passes the same test (Item botica fields)', () => {
    const gate = { param: 'ISBOTICA', or: ['IS_CLIENTE_SUSTITUTO'] };
    expect([gateOpen(gate, params), gateOpen(gate, { ISBOTICA: false }), gateOpen({ param: 'ISBOTICA', or: ['MODO'], in: ['B'] }, { ISBOTICA: false, MODO: 'B' })]).toEqual([true, false, true]);
  });

  it('missing params close every gate', () => {
    expect(gateOpen({ param: 'ISBOTICA', in: [true] }, undefined)).toBe(false);
  });
});

describe('D27b `$params.X` value token', () => {
  it('paramToken names the key of a token and nothing else', () => {
    expect([paramToken('$params.PORC_IGV'), paramToken('PORC_IGV'), paramToken(18), paramToken(undefined)]).toEqual(['PORC_IGV', undefined, undefined, undefined]);
  });

  it('resolveParamToken reads the value from the params and leaves other values alone', () => {
    expect([resolveParamToken('$params.PORC_IGV', params), resolveParamToken('x', params), resolveParamToken('$params.NOPE', params)]).toEqual([18, 'x', undefined]);
  });
});

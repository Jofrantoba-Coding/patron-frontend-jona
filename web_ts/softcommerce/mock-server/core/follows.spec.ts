import { describe, expect, it } from 'vitest';
import { followedValue } from './predicates.js';
import { withFollowed } from './stored.js';

/** D27b (Item): a field that `follows` another takes a value computed from it; the server applies it to a locked follower. */
const ALL = ['INSERT', 'UPDATE', 'DELETE', 'DETAIL', 'CLONE'];
const params = { PORC_IGV: 18 };

describe('followedValue', () => {
  it('without a map the follower copies the source', () => {
    expect(followedValue({ field: 'a' }, { a: '001' }, params)).toBe('001');
  });

  it('with a map it reads the entry of the source text, else `otherwise`, else the empty string', () => {
    const follows = { field: 'tipo', map: { P: true, T: false }, otherwise: 'x' };
    expect([followedValue(follows, { tipo: 'P' }, params), followedValue(follows, { tipo: 'T' }, params), followedValue(follows, { tipo: 'C' }, params)]).toEqual([true, false, 'x']);
    expect(followedValue({ field: 'tipo', map: { P: 1 } }, { tipo: 'C' }, params)).toBe('');
  });

  it('a `$params.X` value resolves against the company params', () => {
    const follows = { field: 'afecto', map: { AFECTO: '$params.PORC_IGV' }, otherwise: 0 };
    expect([followedValue(follows, { afecto: 'AFECTO' }, params), followedValue(follows, { afecto: 'INAFECTO' }, params)]).toEqual([18, 0]);
  });
});

describe('withFollowed', () => {
  const entry = {
    fields: [
      { name: 'stock', kind: 'select' },
      { name: 'compra', kind: 'select', follows: { field: 'stock' }, readOnlyOn: ALL },
      { name: 'afecto', kind: 'options' },
      { name: 'igv', kind: 'number', follows: { field: 'afecto', map: { AFECTO: '$params.PORC_IGV' }, otherwise: 0 }, enabledWhen: { field: 'afecto', in: ['AFECTO'] } },
    ],
  };

  it('a follower that is read-only in every mode always takes the followed value; a body value never wins', () => {
    expect(withFollowed(entry, { stock: '002', compra: '009', afecto: 'AFECTO', igv: 10 }, params)).toMatchObject({ compra: '002' });
  });

  it('a follower that is disabled takes the followed value; an enabled one keeps what the body carries', () => {
    expect(withFollowed(entry, { stock: '001', afecto: 'INAFECTO', igv: 10 }, params)).toMatchObject({ igv: 0 });
    expect(withFollowed(entry, { stock: '001', afecto: 'AFECTO', igv: 10 }, params)).toMatchObject({ igv: 10 });
  });

  it('a blank source leaves a blank follower and the record is not mutated', () => {
    const record = { stock: '', compra: '009' };
    expect(withFollowed(entry, record, params)).toMatchObject({ compra: '' });
    expect(record.compra).toBe('009');
  });
});

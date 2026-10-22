import { describe, expect, it } from 'vitest';
import { filterRows, nextSort, sortRows } from './filterSort';

interface Row {
  id: string;
  name: string;
  city: string;
}

const rows: Row[] = [
  { id: '1', name: 'LIMA', city: 'Lima' },
  { id: '2', name: 'CUSCO', city: 'Cusco' },
  { id: '3', name: 'ARICA', city: 'Alima' },
];
const keys: (keyof Row)[] = ['name', 'city'];

describe('filterRows (S-CRUD-5)', () => {
  it('keeps only rows containing the text, case-insensitively', () => {
    expect(filterRows(rows.slice(0, 2), 'lim', keys).map((r) => r.name)).toEqual(['LIMA']);
  });

  it('matches in any of the given columns, and only those', () => {
    expect(filterRows(rows, 'lim', keys).map((r) => r.id)).toEqual(['1', '3']);
    expect(filterRows(rows, 'lim', ['name']).map((r) => r.id)).toEqual(['1']);
  });

  it('clearing the text (empty or blank) restores every row', () => {
    expect(filterRows(rows, '', keys)).toEqual(rows);
    expect(filterRows(rows, '   ', keys)).toEqual(rows);
  });

  it('returns nothing when no row matches', () => {
    expect(filterRows(rows, 'zzz', keys)).toEqual([]);
  });
});

describe('sortRows and nextSort (S-CRUD-6)', () => {
  it('sorts ascending then descending without mutating the input', () => {
    const asc = sortRows(rows, { key: 'name', direction: 'asc' });
    const desc = sortRows(rows, { key: 'name', direction: 'desc' });

    expect(asc.map((r) => r.name)).toEqual(['ARICA', 'CUSCO', 'LIMA']);
    expect(desc.map((r) => r.name)).toEqual(['LIMA', 'CUSCO', 'ARICA']);
    expect(rows.map((r) => r.id)).toEqual(['1', '2', '3']);
  });

  it('compares numeric strings by value and accented text by locale', () => {
    const ids = [{ id: '10' }, { id: '9' }, { id: '2' }];
    expect(sortRows(ids, { key: 'id', direction: 'asc' }).map((r) => r.id)).toEqual(['2', '9', '10']);

    const names = [{ n: 'Zeta' }, { n: 'Árbol' }, { n: 'Beta' }];
    expect(sortRows(names, { key: 'n', direction: 'asc' }).map((r) => r.n)).toEqual(['Árbol', 'Beta', 'Zeta']);
  });

  it('without a sort the order is kept', () => {
    expect(sortRows(rows, undefined)).toEqual(rows);
  });

  it('header clicks toggle: first ascending, second descending, a new column restarts ascending', () => {
    const first = nextSort(undefined, 'name');
    const second = nextSort(first, 'name');

    expect(first).toEqual({ key: 'name', direction: 'asc' });
    expect(second).toEqual({ key: 'name', direction: 'desc' });
    expect(nextSort(second, 'name')).toEqual({ key: 'name', direction: 'asc' });
    expect(nextSort(second, 'city')).toEqual({ key: 'city', direction: 'asc' });
  });
});

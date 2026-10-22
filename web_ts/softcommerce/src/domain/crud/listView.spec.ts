import { describe, expect, it } from 'vitest';
import { applyListView, isTruncated, withListViewChange, type ListViewState } from './listView';

interface Row {
  id: number;
  name: string;
}

const named = (n: number, prefix = 'ROW'): Row[] =>
  Array.from({ length: n }, (_, i) => ({ id: i + 1, name: `${prefix} ${String(i + 1).padStart(2, '0')}` }));
const base: ListViewState = { filterText: '', page: 1 };
const keys: (keyof Row)[] = ['name'];

describe('applyListView', () => {
  it('pages 20 rows at a time and reports the page count and match count', () => {
    const rows = named(45);

    const first = applyListView(rows, base, keys);
    const last = applyListView(rows, { ...base, page: 3 }, keys);

    expect(first.rows.map((r) => r.id)).toEqual(rows.slice(0, 20).map((r) => r.id));
    expect(first).toMatchObject({ page: 1, pageCount: 3, matchCount: 45 });
    expect(last.rows.map((r) => r.id)).toEqual([41, 42, 43, 44, 45]);
  });

  it('filters first, then sorts, then pages (page counts come from the filtered rows)', () => {
    const rows = [...named(25, 'LIMA'), ...named(3, 'CUSCO')];

    const view = applyListView(rows, { filterText: 'lima', sort: { key: 'id', direction: 'desc' }, page: 2 }, keys);

    expect(view.matchCount).toBe(25);
    expect(view.pageCount).toBe(2);
    expect(view.rows.map((r) => r.id)).toEqual([5, 4, 3, 2, 1]);
  });

  it('clamps an out-of-range page and gives one empty page when nothing matches', () => {
    expect(applyListView(named(5), { ...base, page: 9 }, keys).page).toBe(1);
    expect(applyListView(named(5), { ...base, filterText: 'zzz' }, keys)).toMatchObject({
      rows: [],
      page: 1,
      pageCount: 1,
      matchCount: 0,
    });
  });
});

describe('withListViewChange', () => {
  const onPage3: ListViewState = { filterText: '', page: 3 };

  it('a filter change resets to page 1', () => {
    expect(withListViewChange(onPage3, { filterText: 'lim' })).toEqual({ filterText: 'lim', page: 1 });
  });

  it('a sort change resets to page 1', () => {
    const sort = { key: 'name', direction: 'asc' as const };
    expect(withListViewChange(onPage3, { sort })).toEqual({ filterText: '', sort, page: 1 });
  });

  it('a page change alone keeps filter and sort', () => {
    const state: ListViewState = { filterText: 'lim', sort: { key: 'name', direction: 'desc' }, page: 1 };
    expect(withListViewChange(state, { page: 2 })).toEqual({ ...state, page: 2 });
  });
});

describe('isTruncated', () => {
  it('is true only when the server total exceeds the rows fetched', () => {
    expect(isTruncated({ page: 1, pageSize: 1000, total: 1200 }, 1000)).toBe(true);
    expect(isTruncated({ page: 1, pageSize: 1000, total: 40 }, 40)).toBe(false);
  });
});

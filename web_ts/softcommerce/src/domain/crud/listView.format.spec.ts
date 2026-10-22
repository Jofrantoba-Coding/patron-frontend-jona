import { describe, expect, it } from 'vitest';
import { filterRows } from './filterSort';
import { formatRows } from './listView';

describe('formatRows (R-CRUD-1 bool column)', () => {
  const rows = [
    { id: '1', hab_guia: true, descripcion: 'A' },
    { id: '2', hab_guia: false, descripcion: 'B' },
    { id: '3', descripcion: 'C' },
  ];
  const columns = [{ key: 'descripcion' as const }, { key: 'hab_guia' as const, format: 'bool' as const }];

  it('shows a bool column as Sí / No and a missing value as empty', () => {
    expect(formatRows(columns, rows).map((r) => r.hab_guia)).toEqual(['Sí', 'No', '']);
  });

  it('leaves unformatted columns and the input rows untouched', () => {
    const out = formatRows(columns, rows);
    expect(out.map((r) => r.descripcion)).toEqual(['A', 'B', 'C']);
    expect(rows[0].hab_guia).toBe(true);
  });

  it('the filter matches the rendered text, not the raw boolean', () => {
    const shown = formatRows(columns, rows);
    expect(filterRows(shown, 'sí', ['hab_guia']).map((r) => r.id)).toEqual(['1']);
    expect(filterRows(shown, 'true', ['hab_guia'])).toEqual([]);
  });

  it('without bool columns the rows come back as they are', () => {
    expect(formatRows([{ key: 'descripcion' as const }], rows)).toBe(rows);
  });
});

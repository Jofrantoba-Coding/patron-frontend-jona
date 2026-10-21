import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CrudGrid } from './CrudGrid';
import type { GridColumn } from './InterCrudGrid';

interface Row {
  id: string;
  name: string;
  city: string;
}
const rows: Row[] = [
  { id: '1', name: 'ALFA', city: 'LIMA' },
  { id: '2', name: 'BETA', city: 'CUSCO' },
];
const columns: GridColumn<Row>[] = [
  { key: 'name', header: 'Nombre', sortable: true },
  { key: 'city', header: 'Ciudad' },
];
const base = { columns, rows, idKey: 'id', page: 1, pageCount: 1 } as const;
const rowOf = (text: string) => screen.getByText(text).closest('tr')!;

describe('CrudGrid', () => {
  it('shows one row per item with the configured columns', () => {
    render(<CrudGrid {...base} />);

    expect(rowOf('BETA').textContent).toBe('BETACUSCO');
    expect(screen.getByRole('columnheader', { name: 'Ciudad' })).toBeTruthy();
  });

  it('a row click selects its id and the selected row is marked', async () => {
    const onRowSelect = vi.fn();
    const { rerender } = render(<CrudGrid {...base} onRowSelect={onRowSelect} />);

    await userEvent.setup().click(screen.getByText('BETA'));
    expect(onRowSelect).toHaveBeenCalledWith('2');
    expect(rowOf('BETA').getAttribute('aria-selected')).toBeNull();

    rerender(<CrudGrid {...base} selectedId="2" />);
    expect(rowOf('BETA').getAttribute('aria-selected')).toBe('true');
    expect(rowOf('ALFA').getAttribute('aria-selected')).toBeNull();
  });

  it('a row double click opens its id', async () => {
    const onRowOpen = vi.fn();
    render(<CrudGrid {...base} onRowOpen={onRowOpen} />);

    await userEvent.setup().dblClick(screen.getByText('ALFA'));

    expect(onRowOpen).toHaveBeenCalledWith('1');
  });

  it('a click on a sortable header asks to sort that column; a plain header has no control', async () => {
    const onSortChange = vi.fn();
    render(<CrudGrid {...base} sort={{ key: 'name', direction: 'asc' }} onSortChange={onSortChange} />);

    await userEvent.setup().click(screen.getByRole('button', { name: /Nombre/ }));

    expect(onSortChange).toHaveBeenCalledWith('name');
    expect(screen.getByRole('columnheader', { name: /Nombre/ }).getAttribute('aria-sort')).toBe('ascending');
    expect(screen.queryByRole('button', { name: /Ciudad/ })).toBeNull();
  });

  it('the footer pages through the list', async () => {
    const onPageChange = vi.fn();
    render(<CrudGrid {...base} page={1} pageCount={3} onPageChange={onPageChange} />);

    await userEvent.setup().click(screen.getByRole('button', { name: 'Page 2' }));

    expect(onPageChange).toHaveBeenCalledWith(2);
  });
});

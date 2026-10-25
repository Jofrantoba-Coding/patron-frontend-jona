import React from 'react';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { JDataGrid, JDataGridColumn, JDataGridHandle, InterJDataGrid } from '../JDataGrid';
import { seriousViolations } from '../../__tests__/quality/axe';

interface Cliente {
  id: string;
  codigo: string;
  nombre: string;
}

const rowsOf = (count: number): Cliente[] =>
  Array.from({ length: count }, (_, index) => ({
    id: String(index + 1),
    codigo: String(index + 1).padStart(4, '0'),
    nombre: `Cliente ${index + 1}`,
  }));

const COLUMNS: JDataGridColumn<Cliente>[] = [
  { key: 'codigo', header: 'Código' },
  { key: 'nombre', header: 'Nombre' },
];

type Props = Partial<InterJDataGrid<Cliente>>;

const renderGrid = (props: Props = {}, ref?: React.Ref<JDataGridHandle>) => {
  const handlers = { onSelect: vi.fn(), onOpen: vi.fn(), onSortChange: vi.fn() };
  const view = render(
    <JDataGrid<Cliente>
      ref={ref}
      ariaLabel="Cliente"
      columns={COLUMNS}
      rows={rowsOf(3)}
      rowKey={(row) => row.id}
      {...handlers}
      {...props}
    />,
  );
  return { ...view, ...handlers };
};

const grid = () => screen.getByRole('grid', { name: 'Cliente' });
const dataRows = () => within(grid()).getAllByRole('row').filter((row) => row.closest('tbody'));
const rowOf = (name: string) => screen.getByRole('row', { name: new RegExp(`\\b${name}\\b`) });

describe('JDataGrid roles and selection (R-DAT-2)', () => {
  it('S-DAT-3: a named grid with column headers, gridcells and one selected row', () => {
    renderGrid({ selectedKey: '2' });

    expect(within(grid()).getAllByRole('columnheader').map((header) => header.textContent)).toEqual(['Código', 'Nombre']);
    expect(dataRows()).toHaveLength(3);
    expect(within(dataRows()[0]).getAllByRole('gridcell').map((cell) => cell.textContent)).toEqual(['0001', 'Cliente 1']);
    const selected = dataRows().filter((row) => row.getAttribute('aria-selected') === 'true');
    expect(selected).toEqual([rowOf('Cliente 2')]);
    expect(selected[0]).toHaveAttribute('data-state', 'selected');
  });

  it('S-DAT-3: renders a cell through its column render function', () => {
    renderGrid({ columns: [...COLUMNS, { key: 'accion', header: 'Acción', render: (row) => <em>{`Ver ${row.codigo}`}</em> }] });

    expect(within(dataRows()[1]).getByText('Ver 0002').tagName).toBe('EM');
  });

  it('S-DAT-4: a sortable header reports the next direction and shows aria-sort', () => {
    const sortable = COLUMNS.map((column) => ({ ...column, sortable: true }));
    const { onSortChange, rerender } = renderGrid({ columns: sortable });
    const nombre = screen.getByRole('columnheader', { name: 'Nombre' });
    expect(nombre).not.toHaveAttribute('aria-sort');

    fireEvent.click(within(nombre).getByRole('button', { name: 'Nombre' }));
    expect(onSortChange).toHaveBeenCalledWith('nombre', 'asc');

    rerender(
      <JDataGrid<Cliente>
        ariaLabel="Cliente"
        columns={sortable}
        rows={rowsOf(3)}
        rowKey={(row) => row.id}
        sort={{ key: 'nombre', direction: 'asc' }}
        onSelect={vi.fn()}
        onOpen={vi.fn()}
        onSortChange={onSortChange}
      />,
    );
    expect(screen.getByRole('columnheader', { name: 'Nombre' })).toHaveAttribute('aria-sort', 'ascending');
    expect(screen.getByRole('columnheader', { name: 'Código' })).not.toHaveAttribute('aria-sort');

    fireEvent.click(within(screen.getByRole('columnheader', { name: 'Nombre' })).getByRole('button'));
    expect(onSortChange).toHaveBeenLastCalledWith('nombre', 'desc');
  });

  it('S-DAT-4: a header label sits directly in its cell, aligned like the column cells', () => {
    renderGrid({ columns: [{ key: 'codigo', header: 'Código', sortable: true }, { key: 'nombre', header: 'Nombre', align: 'right' }] });

    const [codigo, nombre] = screen.getAllByRole('columnheader');
    expect(codigo.firstElementChild?.tagName).toBe('BUTTON');
    expect(codigo).toHaveClass('text-left');
    expect(nombre.firstElementChild?.tagName).toBe('SPAN');
    expect(nombre).toHaveClass('text-right');
    expect(within(dataRows()[0]).getAllByRole('gridcell')[1]).toHaveClass('text-right');
  });

  it('S-DAT-5: click selects and double-click opens, value-first', () => {
    const rows = [...rowsOf(6), { id: '7', codigo: '0007', nombre: 'Cliente 7' }];
    const { onSelect, onOpen } = renderGrid({ rows });

    fireEvent.click(within(rowOf('Cliente 7')).getByText('Cliente 7'));
    expect(onSelect).toHaveBeenCalledWith('7');

    fireEvent.doubleClick(rowOf('Cliente 7'));
    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(onOpen).toHaveBeenCalledWith('7');
  });

  it('has no serious axe violations', async () => {
    const { container } = renderGrid({ selectedKey: '1', columns: COLUMNS.map((column) => ({ ...column, sortable: true })) });

    expect(await seriousViolations(container)).toEqual([]);
  });
});

describe('JDataGrid keyboard (R-DAT-3)', () => {
  it('S-DAT-6: one tab stop; Tab enters on the first row and leaves the grid', async () => {
    const user = userEvent.setup();
    render(
      <>
        <button type="button">Antes</button>
        <JDataGrid<Cliente> ariaLabel="Cliente" columns={COLUMNS} rows={rowsOf(3)} rowKey={(row) => row.id} onSelect={vi.fn()} onOpen={vi.fn()} />
        <button type="button">Después</button>
      </>,
    );
    screen.getByRole('button', { name: 'Antes' }).focus();

    await user.tab();
    expect(rowOf('Cliente 1')).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('button', { name: 'Después' })).toHaveFocus();
  });

  it('S-DAT-6: the tab stop is the selected row', () => {
    renderGrid({ selectedKey: '3' });

    expect(dataRows().map((row) => row.tabIndex)).toEqual([-1, -1, 0]);
  });

  it('S-DAT-7: ↓ twice selects 2 then 3 and moves focus; ↑ selects 2', () => {
    const { onSelect } = renderGrid({ selectedKey: '1' });
    rowOf('Cliente 1').focus();

    fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
    expect(onSelect.mock.calls).toEqual([['2'], ['3']]);
    expect(rowOf('Cliente 3')).toHaveFocus();

    fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' });
    expect(onSelect).toHaveBeenLastCalledWith('2');
  });

  it('S-DAT-8: End, Home, PgDn and PgUp on 25 rows', () => {
    const { onSelect } = renderGrid({ rows: rowsOf(25) });
    rowOf('Cliente 1').focus();

    fireEvent.keyDown(document.activeElement!, { key: 'End' });
    expect(onSelect).toHaveBeenLastCalledWith('25');
    fireEvent.keyDown(document.activeElement!, { key: 'Home' });
    expect(onSelect).toHaveBeenLastCalledWith('1');
    fireEvent.keyDown(document.activeElement!, { key: 'PageDown' });
    expect(onSelect).toHaveBeenLastCalledWith('11');

    rowOf('Cliente 5').focus();
    fireEvent.keyDown(document.activeElement!, { key: 'PageUp' });
    expect(onSelect).toHaveBeenLastCalledWith('1');
    expect(rowOf('Cliente 1')).toHaveFocus();
  });

  it('S-DAT-9: Enter opens the focused row once', () => {
    const { onOpen } = renderGrid({ rows: rowsOf(5) });
    rowOf('Cliente 4').focus();

    fireEvent.keyDown(document.activeElement!, { key: 'Enter' });

    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(onOpen).toHaveBeenCalledWith('4');
  });

  it('S-DAT-10: at a bound the key changes nothing but its default is still prevented', () => {
    const { onSelect } = renderGrid({ selectedKey: '3' });
    rowOf('Cliente 3').focus();

    const handled = fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
    const unhandled = fireEvent.keyDown(document.activeElement!, { key: 'ArrowRight' });

    expect(onSelect).not.toHaveBeenCalled();
    expect(handled).toBe(false);
    expect(unhandled).toBe(true);
    expect(rowOf('Cliente 3')).toHaveFocus();
  });

  it('S-DAT-11: a control inside a cell keeps ↓ and Enter', () => {
    const columns: JDataGridColumn<Cliente>[] = [
      ...COLUMNS,
      { key: 'nota', header: 'Nota', render: (row) => <input aria-label={`Nota ${row.id}`} /> },
    ];
    const { onSelect, onOpen } = renderGrid({ columns, selectedKey: '1' });
    const input = screen.getByRole('textbox', { name: 'Nota 1' });
    input.focus();

    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onSelect).not.toHaveBeenCalled();
    expect(onOpen).not.toHaveBeenCalled();
  });

  it('focusRow(key) focuses that row and makes it the tab stop; focusRow() focuses the tab stop', () => {
    const ref = React.createRef<JDataGridHandle>();
    renderGrid({ rows: rowsOf(5), selectedKey: '2' }, ref);

    act(() => ref.current!.focusRow('4'));
    expect(rowOf('Cliente 4')).toHaveFocus();
    expect(rowOf('Cliente 4').tabIndex).toBe(0);

    (document.activeElement as HTMLElement).blur();
    act(() => ref.current!.focusRow());
    expect(rowOf('Cliente 4')).toHaveFocus();
  });
});

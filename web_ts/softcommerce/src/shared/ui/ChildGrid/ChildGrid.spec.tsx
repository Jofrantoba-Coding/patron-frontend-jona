import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ChildGrid } from './ChildGrid';
import type { ChildGridRow } from './InterChildGrid';

const COLUMNS = [{ key: 'direccion', header: 'Direccion' }];
const ROWS: ChildGridRow[] = [
  { _key: '1', direccion: 'AV LIMA 1', estado: 'A' },
  { _key: '2', direccion: 'JR CUSCO 2', estado: 'D' },
  { _key: '3', direccion: 'BORRADA', estado: 'A', activo: false },
  { _key: '~1', direccion: 'NUEVA 4', estado: 'A' },
];
const show = (over: Partial<Parameters<typeof ChildGrid>[0]> = {}) => {
  const handlers = { onSelect: vi.fn(), onAdd: vi.fn() };
  render(<ChildGrid title="Direcciones" columns={COLUMNS} rows={ROWS} readOnly={false} {...handlers} {...over} />);
  return { ...handlers, user: userEvent.setup() };
};
const rowOf = (text: string) => screen.getByText(text).closest('tr') as HTMLElement;

describe('ChildGrid (R-MD-2, S-MD-3)', () => {
  it('shows active and deactivated rows with their state icon, pending ones included, and never a logically deleted row', () => {
    show();
    expect(within(rowOf('AV LIMA 1')).getByRole('img', { name: 'Activo' })).toBeTruthy();
    expect(within(rowOf('JR CUSCO 2')).getByRole('img', { name: 'Desactivado' })).toBeTruthy();
    expect(within(rowOf('NUEVA 4')).getByRole('img', { name: 'Activo' })).toBeTruthy();
    expect(screen.queryByText('BORRADA')).toBeNull();
  });

  it('leads with the state column and keeps the child columns after it', () => {
    show();
    expect(screen.getAllByRole('columnheader').map((h) => h.textContent)).toEqual(['Estado', 'Direccion']);
  });

  it('selects a single row at a time by its key', async () => {
    const { user, onSelect } = show({ selectedId: '2' });
    expect(rowOf('JR CUSCO 2').getAttribute('aria-selected')).toBe('true');
    await user.click(screen.getByText('NUEVA 4'));
    expect(onSelect).toHaveBeenCalledWith('~1');
  });

  it('offers Agregar in the toolbar, which opens the child entry', async () => {
    const { user, onAdd } = show();
    await user.click(within(screen.getByRole('toolbar', { name: 'Direcciones' })).getByRole('button', { name: 'Agregar' }));
    expect(onAdd).toHaveBeenCalledTimes(1);
  });

  it('disables the toolbar when the grid is read-only (DETAIL, DELETE)', async () => {
    const { user, onAdd } = show({ readOnly: true });
    const add = screen.getByRole('button', { name: 'Agregar' }) as HTMLButtonElement;
    expect(add.disabled).toBe(true);
    await user.click(add);
    expect(onAdd).not.toHaveBeenCalled();
  });

  it('offers Quitar only when the register wires it, disabled when read-only', async () => {
    const { user, onAdd } = show();
    expect(screen.queryByRole('button', { name: 'Quitar' })).toBeNull();
    expect(onAdd).not.toHaveBeenCalled();
    const onRemove = vi.fn();
    show({ onRemove });
    await user.click(screen.getByRole('button', { name: 'Quitar' }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('disables Quitar when the grid is read-only', () => {
    show({ onRemove: vi.fn(), readOnly: true });
    expect((screen.getByRole('button', { name: 'Quitar' }) as HTMLButtonElement).disabled).toBe(true);
  });

  it('shows the notice under the toolbar and leaves out Agregar when the entry sits above the grid', () => {
    show({ notice: 'Seleccione Fila.', onAdd: undefined });
    expect(within(screen.getByRole('toolbar', { name: 'Direcciones' })).queryByRole('button', { name: 'Agregar' })).toBeNull();
    expect(screen.getByRole('status').textContent).toBe('Seleccione Fila.');
  });
});

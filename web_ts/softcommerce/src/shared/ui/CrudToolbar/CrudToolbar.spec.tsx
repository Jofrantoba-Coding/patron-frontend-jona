import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DENY_ALL, type Permissions } from '../../../domain/permissions';
import { CrudToolbar } from './CrudToolbar';
import { useCrudToolbarImpl } from './CrudToolbarImpl';

const allow = (...flags: (keyof Permissions)[]): Permissions => ({
  ...DENY_ALL,
  ...Object.fromEntries(flags.map((f) => [f, true])),
});
const button = (name: string) => screen.getByRole('button', { name }) as HTMLButtonElement;

describe('CrudToolbar', () => {
  it('S-CRUD-2 enables Agregar and disables Modificar when only add is granted, even with a row selected', () => {
    render(<CrudToolbar actions={['add', 'modify']} permissions={allow('add')} selectedId="7" />);

    expect(button('Agregar').disabled).toBe(false);
    expect(button('Modificar').disabled).toBe(true);
  });

  it('S-CRUD-3 enables Modificar only once a row is selected', () => {
    const { rerender } = render(<CrudToolbar actions={['modify']} permissions={allow('modify')} />);
    expect(button('Modificar').disabled).toBe(true);

    rerender(<CrudToolbar actions={['modify']} permissions={allow('modify')} selectedId="7" />);
    expect(button('Modificar').disabled).toBe(false);
  });

  it('calls onAction with the action when an enabled button is clicked', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(<CrudToolbar actions={['add', 'refresh']} permissions={allow('add', 'refresh')} onAction={onAction} />);

    await user.click(button('Agregar'));
    await user.click(button('Actualizar'));

    expect(onAction.mock.calls).toEqual([['add'], ['refresh']]);
  });

  it('S-CRUD-4 / S-SHELL-8 clicking a permission-denied Eliminar sends nothing', async () => {
    const onAction = vi.fn();
    render(<CrudToolbar actions={['eliminate']} permissions={allow('add')} selectedId="7" onAction={onAction} />);

    await userEvent.setup().click(button('Eliminar'));

    expect(button('Eliminar').disabled).toBe(true);
    expect(onAction).not.toHaveBeenCalled();
  });

  it('renders export disabled with a "No disponible" tooltip, even with its flag granted', async () => {
    const onAction = vi.fn();
    render(<CrudToolbar actions={['export']} permissions={allow('export')} selectedId="7" onAction={onAction} />);

    await userEvent.setup().click(button('Exportar'));

    expect(button('Exportar').disabled).toBe(true);
    expect(screen.getByTitle('No disponible')).toBeTruthy();
    expect(onAction).not.toHaveBeenCalled();
  });

  it('exposes the toolbar landmark and only the configured actions in order', () => {
    render(<CrudToolbar actions={['refresh', 'add']} permissions={allow('add')} />);

    expect(screen.getByRole('toolbar', { name: 'Acciones' })).toBeTruthy();
    expect(screen.getAllByRole('button').map((b) => b.textContent)).toEqual(['Actualizar', 'Agregar']);
  });
});

describe('useCrudToolbarImpl shortcut path (S-CRUD-4)', () => {
  it('the handler a shortcut would call drops a denied action and forwards a granted one', () => {
    const onAction = vi.fn();
    const denied = renderHook(() =>
      useCrudToolbarImpl({ actions: ['eliminate'], permissions: allow('add'), selectedId: '7', onAction }),
    );
    denied.result.current.onAction?.('eliminate');
    expect(onAction).not.toHaveBeenCalled();

    const granted = renderHook(() =>
      useCrudToolbarImpl({ actions: ['eliminate'], permissions: allow('eliminate'), selectedId: '7', onAction }),
    );
    granted.result.current.onAction?.('eliminate');
    expect(onAction.mock.calls).toEqual([['eliminate']]);
  });
});

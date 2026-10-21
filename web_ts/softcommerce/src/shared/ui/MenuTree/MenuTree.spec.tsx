import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { MenuItem } from '../../../domain/menuTree';
import { MenuTree } from './MenuTree';

const menu: MenuItem[] = [
  { id_menu: 1, id_menu_padre: null, menu_item: 'N', descripcion: 'Maestros', nombre: 'mnMaestros' },
  { id_menu: 2, id_menu_padre: 1, menu_item: 'N', descripcion: 'Generales', nombre: 'mnGenerales' },
  { id_menu: 3, id_menu_padre: 2, menu_item: 'S', descripcion: 'Localidad', nombre: 'mi_localidad' },
  { id_menu: 4, id_menu_padre: null, menu_item: 'N', descripcion: 'Vacio', nombre: 'mnVacio' },
  { id_menu: 5, id_menu_padre: null, menu_item: 'S', descripcion: 'Suelto', nombre: 'miSuelto' },
];

describe('MenuTree', () => {
  it('S-SHELL-3 shows a collapsed submenu children on click and hides them on a second click', async () => {
    const user = userEvent.setup();
    render(<MenuTree items={menu} />);
    const maestros = screen.getByRole('button', { name: 'Maestros' });

    expect(screen.queryByText('Generales')).toBeNull();
    expect(maestros.closest('[aria-expanded]')?.getAttribute('aria-expanded')).toBe('false');

    await user.click(maestros);
    expect(screen.getByRole('button', { name: 'Generales' })).toBeTruthy();
    expect(maestros.closest('[aria-expanded]')?.getAttribute('aria-expanded')).toBe('true');

    await user.click(maestros);
    expect(screen.queryByText('Generales')).toBeNull();
    expect(maestros.closest('[aria-expanded]')?.getAttribute('aria-expanded')).toBe('false');
  });

  it('toggles each submenu independently and keeps a nested one open when a sibling toggles', async () => {
    const user = userEvent.setup();
    render(<MenuTree items={menu} />);

    await user.click(screen.getByRole('button', { name: 'Maestros' }));
    await user.click(screen.getByRole('button', { name: 'Generales' }));
    expect(screen.getByRole('button', { name: 'Localidad' })).toBeTruthy();

    await user.click(screen.getByRole('button', { name: 'Vacio' }));
    expect(screen.getByRole('button', { name: 'Localidad' })).toBeTruthy();
  });

  it('calls onLeafSelect with the clicked leaf item, at any depth', async () => {
    const user = userEvent.setup();
    const onLeafSelect = vi.fn();
    render(<MenuTree items={menu} onLeafSelect={onLeafSelect} />);

    await user.click(screen.getByRole('button', { name: 'Suelto' }));
    await user.click(screen.getByRole('button', { name: 'Maestros' }));
    await user.click(screen.getByRole('button', { name: 'Generales' }));
    await user.click(screen.getByRole('button', { name: 'Localidad' }));

    expect(onLeafSelect.mock.calls.map(([node]) => node.nombre)).toEqual(['miSuelto', 'mi_localidad']);
  });

  it('treats menu_item "N" without children as a submenu: it toggles and is never a leaf', async () => {
    const user = userEvent.setup();
    const onLeafSelect = vi.fn();
    render(<MenuTree items={menu} onLeafSelect={onLeafSelect} />);
    const vacio = screen.getByRole('button', { name: 'Vacio' });

    await user.click(vacio);

    expect(vacio.closest('[aria-expanded]')?.getAttribute('aria-expanded')).toBe('true');
    expect(onLeafSelect).not.toHaveBeenCalled();
  });

  it('S-SHELL-2 renders exactly the entries of another payload', () => {
    render(<MenuTree items={[{ id_menu: 9, id_menu_padre: null, menu_item: 'S', descripcion: 'Only', nombre: 'x' }]} />);

    expect(screen.getAllByRole('button').map((b) => b.textContent)).toEqual(['Only']);
  });
});

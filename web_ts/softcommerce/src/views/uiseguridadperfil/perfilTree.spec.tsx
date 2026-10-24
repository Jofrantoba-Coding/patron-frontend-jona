import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ApiError } from '../../services/ApiError';
import { fakeGrants, menu, openScreen, perfilRows } from './testServices';

const checked = (name: string) => (screen.getByRole('checkbox', { name }) as HTMLInputElement).checked;

async function loadVendedor(grants = fakeGrants()) {
  const screenApi = await openScreen(grants);
  await screenApi.user.click(perfilRows()[0]);
  await screenApi.user.click(screen.getByRole('button', { name: 'Perfil' }));
  await screenApi.loaded('Aduana');
  return screenApi;
}

describe('Seguridad - Perfil menu tree (R-PRM-2)', () => {
  it('loads the tree of the selected perfil with its checks, titled by the perfil, and enables Guardar and Permisos', async () => {
    const { grants } = await loadVendedor();

    expect(grants.menu).toHaveBeenCalledWith('1');
    expect(screen.getByRole('heading', { name: 'VENDEDOR' })).toBeTruthy();
    expect(['Maestros', 'Aduana', 'Registro de Ventas'].map(checked)).toEqual([true, true, false]);
    expect((screen.getByRole('button', { name: 'Guardar' }) as HTMLButtonElement).disabled).toBe(false);
    expect((screen.getByRole('button', { name: 'Permisos' }) as HTMLButtonElement).disabled).toBe(false);
  });

  it('S-PRM-3: unchecking a parent keeps the checkboxes of its children', async () => {
    const { user } = await loadVendedor();

    await user.click(screen.getByRole('checkbox', { name: 'Maestros' }));

    expect(checked('Maestros')).toBe(false);
    expect(['Generales', 'Aduana', 'Color'].map(checked)).toEqual([true, true, true]);
  });

  it('S-PRM-4: Guardar sends exactly the two toggled nodes and confirms', async () => {
    const { user, grants } = await loadVendedor();

    await user.click(screen.getByRole('checkbox', { name: 'Aduana' }));
    await user.click(screen.getByRole('checkbox', { name: 'Registro de Ventas' }));
    await user.click(screen.getByRole('button', { name: 'Guardar' }));

    expect(grants.saveMenu).toHaveBeenCalledWith('1', [{ id: 3, visible: false }, { id: 6, visible: true }]);
    expect(await screen.findByText('Permisos actualizados correctamente')).toBeTruthy();
  });

  it('after a save the stored menu is the new baseline: a second Guardar sends only what changed since', async () => {
    const { user, grants } = await loadVendedor();
    grants.saveMenu.mockImplementationOnce(async () => menu().map((node) => (node.id_menu === 3 ? { ...node, visible: false } : node)));

    await user.click(screen.getByRole('checkbox', { name: 'Aduana' }));
    await user.click(screen.getByRole('button', { name: 'Guardar' }));
    await user.click(await screen.findByRole('button', { name: 'Aceptar' }));
    await user.click(screen.getByRole('checkbox', { name: 'Color' }));
    await user.click(screen.getByRole('button', { name: 'Guardar' }));

    expect(grants.saveMenu).toHaveBeenLastCalledWith('1', [{ id: 4, visible: false }]);
  });

  it('S-PRM-4: a server rejection shows its message and keeps the edits', async () => {
    const saveMenu = vi.fn(async () => {
      throw new ApiError(422, { code: 'VALIDATION_ERROR', message: 'Nodo de menu desconocido', details: [], traceId: 't-1' });
    });
    const { user } = await loadVendedor(fakeGrants({ saveMenu }));

    await user.click(screen.getByRole('checkbox', { name: 'Aduana' }));
    await user.click(screen.getByRole('button', { name: 'Guardar' }));

    expect(await screen.findByText('Nodo de menu desconocido')).toBeTruthy();
    expect(screen.queryByText('Permisos actualizados correctamente')).toBeNull();
    expect(checked('Aduana')).toBe(false);
  });
});

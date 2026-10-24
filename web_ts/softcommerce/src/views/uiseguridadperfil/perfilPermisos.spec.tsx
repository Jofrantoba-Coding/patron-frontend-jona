import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ADUANA_FLAGS, fakeGrants, forms, openScreen, perfilRows } from './testServices';


async function loaded(grants = fakeGrants()) {
  const api = await openScreen(grants);
  await api.user.click(perfilRows()[0]);
  await api.user.click(screen.getByRole('button', { name: 'Perfil' }));
  await api.loaded('Aduana');
  return api;
}
const dialog = () => screen.getByRole('dialog');
const flag = (name: string) => within(dialog()).getByRole('checkbox', { name }) as HTMLInputElement;

describe('Seguridad - Perfil Permisos dialog (R-PRM-3)', () => {
  it('S-PRM-5: Permisos is refused, without opening, with no node, with an unchecked node and with a node with no form', async () => {
    const { user, grants } = await loaded();

    await user.click(screen.getByRole('button', { name: 'Permisos' }));
    expect(await screen.findByText('Seleccione Opcion')).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'Aceptar' }));

    await user.click(screen.getByRole('button', { name: 'Registro de Ventas' })); // unchecked
    await user.click(screen.getByRole('button', { name: 'Permisos' }));
    expect(await screen.findByText('No tiene Permisos para acceder a Opcion')).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'Aceptar' }));

    await user.click(screen.getByRole('button', { name: 'Generales' })); // a submenu: no form
    await user.click(screen.getByRole('button', { name: 'Permisos' }));
    expect(await screen.findByText('Opcion no tiene Asociado un formulario')).toBeTruthy();
    expect(screen.queryByRole('dialog', { name: /Perfil/ })).toBeNull();
    expect(grants.permiso).not.toHaveBeenCalled();
  });

  it('S-PRM-6: the dialog is titled by the perfil, headed by the option and lists the 13 flags with the perfil values', async () => {
    const { user, grants } = await loaded(fakeGrants());
    grants.permiso.mockResolvedValue({ ...ADUANA_FLAGS });

    await user.click(screen.getByRole('button', { name: 'Aduana' }));
    await user.click(screen.getByRole('button', { name: 'Permisos' }));

    expect(await screen.findByText('Perfil VENDEDOR')).toBeTruthy();
    expect(screen.getByText('OPCION: ADUANA')).toBeTruthy();
    expect(grants.permiso).toHaveBeenCalledWith('1', 'miAduana');
    expect(within(dialog()).getAllByRole('checkbox')).toHaveLength(13);
    expect([flag('Agregar').checked, flag('Eliminar').checked, flag('Anular').checked]).toEqual([true, true, false]);
  });

  it('S-PRM-6: unchecking eliminate and Guardar sends that one cell for the form, then confirms', async () => {
    const { user, grants } = await loaded(fakeGrants());
    grants.permiso.mockResolvedValue({ ...ADUANA_FLAGS });
    grants.savePermiso.mockResolvedValue({ ...ADUANA_FLAGS, eliminate: false });

    await user.click(screen.getByRole('button', { name: 'Aduana' }));
    await user.click(screen.getByRole('button', { name: 'Permisos' }));
    await screen.findByText('Perfil VENDEDOR');
    await user.click(flag('Eliminar'));
    await user.click(within(dialog()).getByRole('button', { name: 'Guardar' }));

    expect(grants.savePermiso).toHaveBeenCalledWith('1', 'miAduana', [{ formId: 'miAduana', flag: 'eliminate', value: false }]);
    expect(await within(dialog()).findByText('Permisos actualizados correctamente')).toBeTruthy();
  });
});

describe('Seguridad - Perfil Permisos de Formulario matrix (R-PRM-4)', () => {
  it('S-PRM-7: with no perfil row it shows Seleccione Fila titled Perfiles and opens nothing', async () => {
    const { user, grants } = await openScreen();

    await user.click(screen.getByRole('button', { name: 'Permisos de Formulario' }));

    expect(await screen.findByText('Seleccione Fila')).toBeTruthy();
    expect(screen.getByText('Perfiles')).toBeTruthy();
    expect(grants.permisos).not.toHaveBeenCalled();
  });

  it('S-PRM-7: a perfil lists every form with its 13 flags as accordion rows and saves only the changed cells', async () => {
    const grants = fakeGrants();
    grants.permisos.mockResolvedValue(forms());
    grants.savePermisos.mockResolvedValue(forms());
    const { user } = await openScreen(grants);

    await user.click(perfilRows()[1]);
    await user.click(screen.getByRole('button', { name: 'Permisos de Formulario' }));

    expect(await screen.findByText('Perfil CAJERO')).toBeTruthy();
    expect(grants.permisos).toHaveBeenCalledWith('2');
    const rows = within(dialog()).getAllByRole('button', { name: /^mi/ });
    expect(rows.map((r) => r.textContent?.replace('▾', ''))).toEqual(['miAduana', 'miColor']);
    expect(rows[0].className).toContain('min-h-11');
    expect(within(dialog()).queryByText(/^OPCION/)).toBeNull();

    await user.click(rows[1]);
    await user.click(within(dialog()).getByRole('checkbox', { name: 'Agregar' }));
    await user.click(within(dialog()).getByRole('button', { name: 'Guardar' }));

    expect(grants.savePermisos).toHaveBeenCalledWith('2', [{ formId: 'miColor', flag: 'add', value: false }]);
  });
});

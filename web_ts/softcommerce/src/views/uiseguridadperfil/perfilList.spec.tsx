import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { openScreen, perfilRows } from './testServices';

const rows = perfilRows;

describe('Seguridad - Perfil list and filters (R-PRM-1, R-PRM-2)', () => {
  it('S-PRM-1: Desc. keeps the matching perfil and selects it; a T Trabajador that does not match leaves none', async () => {
    const { user } = await openScreen();
    expect(rows().map((r) => r.textContent)).toEqual(expect.arrayContaining([expect.stringContaining('VENDEDOR'), expect.stringContaining('CAJERO')]));

    await user.type(screen.getByLabelText('Desc.'), 'ven');

    expect((screen.getByLabelText('Desc.') as HTMLInputElement).value).toBe('VEN');
    expect(rows()).toHaveLength(1);
    expect(rows()[0].textContent).toContain('VENDEDOR');
    expect(rows()[0].getAttribute('aria-selected')).toBe('true');

    await user.selectOptions(screen.getByLabelText('T Trabajador'), 'CAJA');

    expect(rows()).toHaveLength(0);
  });

  it('lists the tipos trabajador after the empty option and shows each perfil with its tipo', async () => {
    await openScreen();
    const select = screen.getByLabelText('T Trabajador');

    expect(within(select).getAllByRole('option').map((o) => o.textContent)).toEqual(['--- Seleccione---', 'VENTAS', 'CAJA']);
    expect(rows()[1].textContent).toContain('CAJA');
  });

  it('S-PRM-2: Perfil with no selected row shows Seleccione Fila titled Perfiles, loads nothing and keeps Guardar and Permisos disabled', async () => {
    const { user, grants } = await openScreen();

    await user.click(screen.getByRole('button', { name: 'Perfil' }));

    expect(await screen.findByText('Seleccione Fila')).toBeTruthy();
    expect(screen.getByText('Perfiles')).toBeTruthy();
    expect(grants.menu).not.toHaveBeenCalled();
    expect(screen.queryAllByRole('checkbox')).toHaveLength(0);
    expect((screen.getByRole('button', { name: 'Guardar' }) as HTMLButtonElement).disabled).toBe(true);
    expect((screen.getByRole('button', { name: 'Permisos' }) as HTMLButtonElement).disabled).toBe(true);
  });
});

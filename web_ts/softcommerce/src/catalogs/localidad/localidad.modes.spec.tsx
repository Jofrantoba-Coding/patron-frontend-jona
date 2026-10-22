import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { field, pick, renderLocalidad } from './testkit';

type Kit = ReturnType<typeof renderLocalidad>;

/** Selects the row, runs a toolbar action and waits for the dialog to finish loading. */
async function openMode(kit: Kit, row: string, action: string) {
  await kit.user.click(await screen.findByText(row));
  await kit.user.click(screen.getByRole('button', { name: action }));
  await screen.findByLabelText('Descripción');
}

const submit = async ({ user }: Kit) => {
  await user.click(screen.getByRole('button', { name: 'Aceptar' }));
  await user.click(await screen.findByRole('button', { name: 'Confirmar' }));
};

describe('Localidad modes', () => {
  it('S-LOC-2 INSERT sends uppercase values and the distrito id as id_ubigeo, then selects the new row', async () => {
    const kit = renderLocalidad();
    const create = vi.spyOn(kit.catalog, 'create');
    await screen.findByText('LOCAL ATE');
    await kit.user.click(screen.getByRole('button', { name: 'Agregar' }));
    await pick(kit.user, 'Empresa', 'COMERCIAL DEMO SAC');
    await kit.user.type(await screen.findByLabelText('Descripción'), 'sede lima');
    await kit.user.type(field('Dirección'), 'av. x 123');
    await pick(kit.user, 'Departamento', 'LIMA');
    await pick(kit.user, 'Provincia', 'LIMA');
    await pick(kit.user, 'Distrito', 'ATE');

    await submit(kit);

    expect(create).toHaveBeenCalledWith({ id_empresa: '1', descripcion: 'SEDE LIMA', direccion: 'AV. X 123', id_ubigeo: '150103' });
    await waitFor(() => expect(screen.getByText('SEDE LIMA').closest('tr')?.getAttribute('aria-selected')).toBe('true'));
  });

  it('S-LOC-11 UPDATE restores the three ubigeo levels with their options loaded', async () => {
    const kit = renderLocalidad();

    await openMode(kit, 'LOCAL ATE', 'Modificar');

    await waitFor(() => expect(field('Distrito').value).toBe('150103'));
    expect([field('Empresa').value, field('Departamento').value, field('Provincia').value]).toEqual(['1', '15', '1501']);
    expect(Array.from((field('Provincia') as HTMLSelectElement).options).map((o) => o.text)).toEqual(['Seleccione', 'LIMA', 'CANETE']);
  });

  it('S-LOC-12 UPDATE shows the new direccion in the list', async () => {
    const kit = renderLocalidad();
    const update = vi.spyOn(kit.catalog, 'update');
    await openMode(kit, 'LOCAL ATE', 'Modificar');
    await waitFor(() => expect(field('Distrito').value).toBe('150103'));

    await kit.user.clear(field('Dirección'));
    await kit.user.type(field('Dirección'), 'jr. nuevo 9');
    await submit(kit);

    expect(await screen.findByText('JR. NUEVO 9')).toBeTruthy();
    expect(update).toHaveBeenCalledWith('2', expect.objectContaining({ direccion: 'JR. NUEVO 9', id_ubigeo: '150103' }));
  });

  it('S-LOC-13 DELETE leaves the list while the record stays on the server', async () => {
    const kit = renderLocalidad();
    await openMode(kit, 'LOCAL ATE', 'Eliminar');

    await submit(kit);

    await waitFor(() => expect(screen.queryByText('LOCAL ATE')).toBeNull());
    await expect(kit.catalog.get('2')).resolves.toMatchObject({ id_localidad: '2', descripcion: 'LOCAL ATE' });
  });

  it('S-LOC-14 DELETE is disabled without the eliminate flag', async () => {
    const kit = renderLocalidad({ add: true });
    await kit.user.click(await screen.findByText('LOCAL ATE'));

    expect(screen.getByRole('button', { name: 'Eliminar' }).hasAttribute('disabled')).toBe(true);
  });

  it('S-LOC-15 DETAIL shows every field populated and read-only', async () => {
    const kit = renderLocalidad();
    await kit.user.dblClick(await screen.findByText('LOCAL ATE'));
    await screen.findByLabelText('Descripción');

    await waitFor(() => expect(field('Distrito').value).toBe('150103'));
    expect((field('Descripción') as HTMLInputElement).readOnly).toBe(true);
    expect(field('Descripción').value).toBe('LOCAL ATE');
    expect(['Empresa', 'Departamento', 'Provincia', 'Distrito'].map((l) => (field(l) as HTMLSelectElement).disabled)).toEqual([true, true, true, true]);
  });

  it('S-LOC-16 CLONE creates a new record with identical data and keeps the original', async () => {
    const kit = renderLocalidad();
    const create = vi.spyOn(kit.catalog, 'create');
    await openMode(kit, 'LOCAL ATE', 'Clonar');
    await waitFor(() => expect(field('Distrito').value).toBe('150103'));

    await submit(kit);

    await waitFor(() => expect(screen.getAllByText('LOCAL ATE')).toHaveLength(2));
    expect(create).toHaveBeenCalledWith({ id_empresa: '1', descripcion: 'LOCAL ATE', direccion: 'AV. NICOLAS AYLLON 500', id_ubigeo: '150103' });
  });
});

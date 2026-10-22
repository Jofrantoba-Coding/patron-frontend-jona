import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { field, pick, renderLocalidad } from './testkit';

async function openInsert() {
  const kit = renderLocalidad();
  await screen.findByText('LOCAL ATE');
  await kit.user.click(screen.getByRole('button', { name: 'Agregar' }));
  await screen.findByLabelText('Descripción');
  return kit;
}

describe('Localidad config', () => {
  it('S-LOC-1 lists the active localidades with empresa and ubigeo names resolved', async () => {
    renderLocalidad();

    const row = (await screen.findByText('LOCAL ATE')).closest('tr')!;

    expect(within(row).getAllByRole('cell').map((cell) => cell.textContent)).toEqual([
      'LOCAL ATE', 'AV. NICOLAS AYLLON 500', 'COMERCIAL DEMO SAC', 'LIMA', 'LIMA', 'ATE',
    ]);
    expect(screen.queryByText('LOCAL CERRADO')).toBeNull();
    expect(screen.getAllByRole('row')).toHaveLength(5);
  });

  it('S-LOC-3 blocks the submit when only the empresa is missing', async () => {
    const { user } = await openInsert();
    await user.type(field('Descripción'), 'sede lima');
    await user.type(field('Dirección'), 'av. x 123');
    await pick(user, 'Departamento', 'LIMA');
    await pick(user, 'Provincia', 'LIMA');
    await pick(user, 'Distrito', 'ATE');

    await user.click(screen.getByRole('button', { name: 'Aceptar' }));

    expect((await screen.findByRole('alert')).textContent).toBe('Empresa es obligatorio.');
    expect(screen.queryByRole('button', { name: 'Confirmar' })).toBeNull();
  });

  it('S-LOC-5 blocks the submit when the distrito is missing', async () => {
    const { user } = await openInsert();
    await pick(user, 'Empresa', 'COMERCIAL DEMO SAC');
    await user.type(field('Descripción'), 'sede lima');
    await user.type(field('Dirección'), 'av. x 123');
    await pick(user, 'Departamento', 'LIMA');
    await pick(user, 'Provincia', 'LIMA');

    await user.click(screen.getByRole('button', { name: 'Aceptar' }));

    expect((await screen.findByRole('alert')).textContent).toBe('Distrito es obligatorio.');
  });

  it('S-LOC-4 ignores an insertion past 100 chars and a paste that would overflow, whole', async () => {
    const { user } = await openInsert();
    const descripcion = field('Descripción');

    await user.click(descripcion);
    await user.paste('a'.repeat(100));
    await user.type(descripcion, 'b');
    expect(descripcion.value).toBe('A'.repeat(100));

    const direccion = field('Dirección');
    await user.click(direccion);
    await user.paste('c'.repeat(95));
    await user.paste('d'.repeat(10));
    expect(direccion.value).toBe('C'.repeat(95));
  });

  it('S-LOC-17 offers one Eliminar action and no physical delete in the toolbar', async () => {
    renderLocalidad();
    await screen.findByText('LOCAL ATE');

    const names = within(screen.getByRole('toolbar', { name: 'Acciones' })).getAllByRole('button').map((b) => b.textContent);

    expect(names).toEqual(['Agregar', 'Modificar', 'Eliminar', 'Clonar', 'Detalle', 'Buscar', 'Actualizar']);
  });
});

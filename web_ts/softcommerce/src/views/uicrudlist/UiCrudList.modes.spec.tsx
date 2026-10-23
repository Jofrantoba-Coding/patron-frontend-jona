import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { CatalogConfig, CrudMode } from '../../catalogs/CatalogConfig';
import { PERMISSION_FLAGS, type Permissions } from '../../domain/permissions';
import type { InterCatalogService } from '../../services/InterCatalogService';
import { DialogStackProvider } from '../uishell/DialogStackProvider';
import { UiCrudList } from './UiCrudList';

interface Row {
  id: string;
  name: string;
}
const allGranted = Object.fromEntries(PERMISSION_FLAGS.map((f) => [f, true])) as Permissions;
const rows: Row[] = [{ id: '1', name: 'ALFA' }];
const service = {
  list: vi.fn(async () => ({ items: rows, pagination: { page: 1, pageSize: 1000, total: 1 } })),
  get: vi.fn(async () => rows[0]),
  create: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
} as unknown as InterCatalogService<Row>;
const config = (modes?: CrudMode[]): CatalogConfig<Row> => ({
  formId: 'f', title: 'Empresa', catalog: 'empresa', idKey: 'id', columns: [{ key: 'name', header: 'Nombre' }],
  fields: [{ kind: 'text', name: 'name', label: 'Nombre' }], modes,
});

async function renderList(modes?: CrudMode[]) {
  render(
    <DialogStackProvider>
      <UiCrudList config={config(modes)} service={service} permissions={allGranted} />
    </DialogStackProvider>,
  );
  return screen.findByText('ALFA');
}

describe('S-CRUD-36 / S-REG-13 mode capability in the list', () => {
  it('renders no add, eliminate or clone button and Alt+A does nothing; modify and detail remain', async () => {
    const cell = await renderList(['UPDATE', 'DETAIL']);
    for (const name of ['Agregar', 'Eliminar', 'Clonar']) expect(screen.queryByRole('button', { name })).toBeNull();
    expect(screen.getByRole('button', { name: 'Modificar' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Detalle' })).toBeTruthy();

    fireEvent.keyDown(cell, { altKey: true, code: 'KeyA' });
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('double-click opens DETAIL when it is supported', async () => {
    const cell = await renderList(['UPDATE', 'DETAIL']);
    await userEvent.setup().dblClick(cell);
    expect(await screen.findByText('Detalle: Empresa')).toBeTruthy();
  });

  it('double-click is inert when DETAIL is not supported', async () => {
    const cell = await renderList(['UPDATE']);
    await userEvent.setup().dblClick(cell);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('without modes (Wave 1) every action stays', async () => {
    await renderList();
    for (const name of ['Agregar', 'Modificar', 'Eliminar', 'Clonar', 'Detalle']) expect(screen.getByRole('button', { name })).toBeTruthy();
  });
});

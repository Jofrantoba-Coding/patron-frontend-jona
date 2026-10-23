import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { CatalogConfig } from '../../catalogs/CatalogConfig';
import { PERMISSION_FLAGS, type Permissions } from '../../domain/permissions';
import type { InterCatalogService } from '../../services/InterCatalogService';
import { DialogStackProvider } from '../uishell/DialogStackProvider';
import { UiCrudList } from './UiCrudList';

interface Row {
  id: string;
  descripcion: string;
  hab_guia: boolean;
}
const rows: Row[] = [
  { id: '1', descripcion: 'VENTA', hab_guia: true },
  { id: '2', descripcion: 'CONSIGNACION', hab_guia: false },
];
const service = {
  list: vi.fn(async () => ({ items: rows, pagination: { page: 1, pageSize: 1000, total: 2 } })),
  get: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
} as unknown as InterCatalogService<Row>;
const config: CatalogConfig<Row> = {
  formId: 'miMotivoTraslado', title: 'Motivo Traslado', catalog: 'motivos-traslado', idKey: 'id',
  columns: [{ key: 'descripcion', header: 'Descripción' }, { key: 'hab_guia', header: 'Hab Guia', format: 'bool' }],
  fields: [{ kind: 'text', name: 'descripcion', label: 'Descripción' }],
};
const allGranted = Object.fromEntries(PERMISSION_FLAGS.map((f) => [f, true])) as Permissions;
const rowOf = (text: string) => screen.getByText(text).closest('tr')!;

async function renderList() {
  render(
    <DialogStackProvider>
      <UiCrudList config={config} service={service} permissions={allGranted} />
    </DialogStackProvider>,
  );
  await screen.findByText('VENTA');
}

describe('S-CRUD-37 bool column in the list', () => {
  it('renders Sí / No instead of the boolean', async () => {
    await renderList();
    expect(rowOf('VENTA').textContent).toBe('VENTASí');
    expect(rowOf('CONSIGNACION').textContent).toBe('CONSIGNACIONNo');
  });

  it('typing the rendered text in the filter narrows the rows', async () => {
    await renderList();
    await userEvent.setup().type(screen.getByLabelText('Filtro'), 'no');
    expect(screen.queryByText('VENTA')).toBeNull();
    expect(screen.getByText('CONSIGNACION')).toBeTruthy();
  });
});

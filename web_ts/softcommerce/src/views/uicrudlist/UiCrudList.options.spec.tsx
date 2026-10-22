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
  tipo: string;
  tipo_label: string;
}
const rows: Row[] = [
  { id: '1', descripcion: 'COMPRA', tipo: 'E', tipo_label: 'Entrada' },
  { id: '2', descripcion: 'VENTA', tipo: 'S', tipo_label: 'Salida' },
];
const service = {
  list: vi.fn(async () => ({ items: rows, pagination: { page: 1, pageSize: 1000, total: 2 } })),
  get: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
} as unknown as InterCatalogService<Row>;
// The server sends `<name>_label` next to the code; the column reads the label (R-MOCK-14).
const config: CatalogConfig<Row> = {
  formId: 'miClasifInventario', title: 'Tipo de Movimiento de Inventario', catalog: 'clasif-inventarios', idKey: 'id',
  columns: [{ key: 'descripcion', header: 'Descripción' }, { key: 'tipo_label', header: 'Tipo de Movimiento' }],
  fields: [{ kind: 'text', name: 'descripcion', label: 'Descripción' }],
};
const allGranted = Object.fromEntries(PERMISSION_FLAGS.map((f) => [f, true])) as Permissions;

async function renderList() {
  render(
    <DialogStackProvider>
      <UiCrudList config={config} service={service} permissions={allGranted} />
    </DialogStackProvider>,
  );
  await screen.findByText('COMPRA');
}

describe('S-CRUD-37 option column in the list', () => {
  it('shows the option label, not the code', async () => {
    await renderList();
    expect(screen.getByText('Entrada')).toBeTruthy();
    expect(screen.getByText('Salida')).toBeTruthy();
    expect(screen.queryByText('E')).toBeNull();
  });

  it('the filter matches the label', async () => {
    await renderList();
    await userEvent.setup().type(screen.getByLabelText('Filtro'), 'salida');
    expect(screen.queryByText('COMPRA')).toBeNull();
    expect(screen.getByText('VENTA')).toBeTruthy();
  });

  it('typing the code does not match: only what is rendered is searched', async () => {
    await renderList();
    await userEvent.setup().type(screen.getByLabelText('Filtro'), 'zzz');
    expect(screen.queryByText('COMPRA')).toBeNull();
    expect(screen.queryByText('VENTA')).toBeNull();
  });
});

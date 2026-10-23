import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { CatalogConfig } from '../../catalogs/CatalogConfig';
import { PERMISSION_FLAGS, type Permissions } from '../../domain/permissions';
import type { InterCatalogService } from '../../services/InterCatalogService';
import { DialogStackProvider } from '../uishell/DialogStackProvider';
import { UiCrudList } from './UiCrudList';

type Row = Record<string, string>;
// The server adds the joined name beside the ref id (R-REG-8); a join over a missing or inactive target is ''.
const rows: Row[] = [
  { id_motivo_descuento: '1', descripcion: 'PRONTO PAGO', abrev: 'PP', id_tipo_descuento: '1', tipo_descuento: 'PORCENTAJE' },
  { id_motivo_descuento: '2', descripcion: 'AJUSTE', abrev: 'AJ', id_tipo_descuento: '9', tipo_descuento: '' },
  { id_motivo_descuento: '3', descripcion: 'SIN TIPO', abrev: 'ST', id_tipo_descuento: '2' },
];
// The columns of a registry entry with a join: the key is the join `as`, so the grid reads the joined name.
const config: CatalogConfig<Row> = {
  formId: 'miMotivoDescuento', title: 'Motivo Descuento', catalog: 'motivos-descuento', idKey: 'id_motivo_descuento',
  columns: [
    { key: 'id_motivo_descuento', header: 'Código' }, { key: 'descripcion', header: 'Descripción' }, { key: 'abrev', header: 'Abrev' },
    { key: 'tipo_descuento', header: 'Tipo Dscto' },
  ],
  fields: [{ kind: 'text', name: 'descripcion', label: 'Descripción' }],
};
const service = {
  list: vi.fn(async () => ({ items: rows, pagination: { page: 1, pageSize: 1000, total: 3 } })),
} as unknown as InterCatalogService<Row>;
const allGranted = Object.fromEntries(PERMISSION_FLAGS.map((f) => [f, true])) as Permissions;

async function renderList() {
  render(
    <DialogStackProvider>
      <UiCrudList config={config} service={service} permissions={allGranted} />
    </DialogStackProvider>,
  );
  await screen.findByText('PRONTO PAGO');
}
const cellsOf = (name: string) => screen.getByText(name).closest('tr')!.querySelectorAll('td');

// S-CRUD-37 joined part: the column key is the registry join `as`, so it reads the name the server joined.
describe('S-CRUD-37 joined column in the list', () => {
  it('renders the joined name in its own column', async () => {
    await renderList();
    expect(screen.getByRole('columnheader', { name: 'Tipo Dscto' })).toBeTruthy();
    expect([...cellsOf('PRONTO PAGO')].map((td) => td.textContent)).toEqual(['1', 'PRONTO PAGO', 'PP', 'PORCENTAJE']);
  });

  it('a missing or inactive join renders empty, without error', async () => {
    await renderList();
    expect(cellsOf('AJUSTE')[3].textContent).toBe('');
    expect(cellsOf('SIN TIPO')[3].textContent).toBe('');
  });

  it('typing the joined name narrows the rows', async () => {
    await renderList();
    await userEvent.setup().type(screen.getByLabelText('Filtro'), 'porcentaje');
    expect(screen.getByText('PRONTO PAGO')).toBeTruthy();
    expect(screen.queryByText('AJUSTE')).toBeNull();
    expect(screen.queryByText('SIN TIPO')).toBeNull();
  });

  it('typing the ref id does not match: only what is rendered is searched', async () => {
    await renderList();
    await userEvent.setup().type(screen.getByLabelText('Filtro'), '9');
    expect(screen.queryByText('AJUSTE')).toBeNull();
  });
});

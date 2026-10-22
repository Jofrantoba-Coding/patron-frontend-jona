import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { CatalogConfig } from '../../catalogs/CatalogConfig';
import { DENY_ALL } from '../../domain/permissions';
import { ApiError } from '../../services/ApiError';
import type { InterCatalogService, Page } from '../../services/InterCatalogService';
import { UiCrudList } from './UiCrudList';

interface Row {
  id: string;
  name: string;
}
const config: CatalogConfig<Row> = {
  formId: 'f',
  title: 'Prueba',
  catalog: 'prueba',
  idKey: 'id',
  columns: [{ key: 'name', header: 'Nombre', sortable: true }],
  fields: [],
  actions: ['modify', 'refresh'],
};
const permissions = { ...DENY_ALL, modify: true, refresh: true };
const page = (items: Row[], total = items.length): Page<Row> => ({ items, pagination: { page: 1, pageSize: 1000, total } });
const rows: Row[] = [
  { id: '1', name: 'ALFA' },
  { id: '2', name: 'BETA' },
];
const show = (list: InterCatalogService<Row>['list']) =>
  render(<UiCrudList config={config} service={{ list } as InterCatalogService<Row>} permissions={permissions} />);

describe('UiCrudList states', () => {
  it('S-CRUD-1 shows loading while the request is pending, with no table yet', () => {
    show(() => new Promise(() => {}));

    expect(screen.getByText('Cargando...')).toBeTruthy();
    expect(screen.queryByRole('table')).toBeNull();
  });

  it('S-CRUD-1 shows an empty message when the catalog has no items', async () => {
    show(vi.fn(async () => page([])));
    expect((await screen.findByText('No hay registros.')).tagName).toBe('P');
  });

  it('shows the rows, and the empty message only after a filter matches nothing', async () => {
    const user = userEvent.setup();
    show(vi.fn(async () => page(rows)));
    expect(await screen.findByText('BETA')).toBeTruthy();
    expect(screen.queryByText('No hay registros.')).toBeNull();

    await user.type(screen.getByLabelText('Filtro'), 'zzz');

    expect(screen.getByText('No hay registros.')).toBeTruthy();
  });

  it('S-CRUD-1 shows the error with its trace id and Reintentar loads the rows', async () => {
    const user = userEvent.setup();
    const list = vi
      .fn()
      .mockRejectedValueOnce(new ApiError(500, { code: 'INTERNAL', message: 'Fallo del servidor', traceId: 'T-9', details: [] }))
      .mockResolvedValue(page(rows));
    show(list);

    expect((await screen.findByRole('alert')).textContent).toContain('Fallo del servidor');
    expect(screen.getByRole('alert').textContent).toContain('T-9');
    await user.click(screen.getByRole('button', { name: 'Reintentar' }));

    expect(await screen.findByText('ALFA')).toBeTruthy();
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('warns that the list is incomplete only when the server holds more rows', async () => {
    const { unmount } = show(vi.fn(async () => page(rows, 1500)));
    expect(await screen.findByText(/incompleta/)).toBeTruthy();
    unmount();

    show(vi.fn(async () => page(rows)));
    await screen.findByText('ALFA');
    expect(screen.queryByText(/incompleta/)).toBeNull();
  });

  it('wires the toolbar to the selected row and the filter to the grid', async () => {
    const user = userEvent.setup();
    show(vi.fn(async () => page(rows)));
    const modify = () => screen.getByRole('button', { name: 'Modificar' }) as HTMLButtonElement;
    await screen.findByText('ALFA');
    expect(modify().disabled).toBe(true);

    await user.click(screen.getByText('BETA'));
    expect(modify().disabled).toBe(false);

    await user.type(screen.getByLabelText('Filtro'), 'alf');
    expect(screen.queryByText('BETA')).toBeNull();
    expect(screen.getByText('ALFA')).toBeTruthy();
  });
});

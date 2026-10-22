import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { CatalogConfig } from '../../catalogs/CatalogConfig';
import { DENY_ALL, type Permissions } from '../../domain/permissions';
import type { InterCatalogService } from '../../services/InterCatalogService';
import { DialogStackProvider } from '../uishell/DialogStackProvider';
import { UiCrudList } from './UiCrudList';

interface Item {
  id: string;
  label: string;
}
/** A second, minimal catalog: only config differs, no template code. */
const config: CatalogConfig<Item> = {
  formId: 'otra',
  title: 'Otra',
  catalog: 'otras',
  idKey: 'id',
  columns: [{ key: 'label', header: 'Etiqueta', sortable: true }],
  fields: [{ kind: 'text', name: 'label', label: 'Etiqueta', required: true, uppercase: true }],
};

function mount(permissions: Partial<Permissions>) {
  const items: Item[] = [{ id: '1', label: 'ALFA' }];
  const service = {
    list: vi.fn(async () => ({ items: [...items], pagination: { page: 1, pageSize: 1000, total: items.length } })),
    get: vi.fn(async (id: string) => items.find((i) => i.id === id)),
    create: vi.fn(async (values: Partial<Item>) => {
      const row = { id: '2', label: '', ...values };
      items.push(row);
      return row;
    }),
  } as unknown as InterCatalogService<Item>;
  render(
    <DialogStackProvider>
      <UiCrudList config={config} service={service} permissions={{ ...DENY_ALL, ...permissions }} />
    </DialogStackProvider>,
  );
  return { user: userEvent.setup(), service };
}

describe('UiCrudList to register wiring', () => {
  it.each([
    { details: true, opens: true },
    { details: false, opens: false },
  ])('S-CRUD-7 double-click with details=$details opens DETAIL: $opens', async ({ details, opens }) => {
    const { user } = mount({ details });
    await user.dblClick(await screen.findByText('ALFA'));
    if (opens) expect(await screen.findByText('Detalle: Otra')).toBeTruthy();
    else expect(screen.queryByText('Detalle: Otra')).toBeNull();
  });

  it('S-CRUD-22 a minimal config lists, registers and reselects the new row with no new template code', async () => {
    const { user } = mount({ add: true, refresh: true });
    await screen.findByText('ALFA');
    await user.click(screen.getByRole('button', { name: 'Agregar' }));
    await user.type(await screen.findByLabelText('Etiqueta'), 'beta');
    await user.click(screen.getByRole('button', { name: 'Aceptar' }));
    await user.click(screen.getByRole('button', { name: 'Confirmar' }));
    await waitFor(() => expect(screen.getByText('BETA').closest('tr')?.getAttribute('aria-selected')).toBe('true'));
    expect(screen.queryByText('Nuevo: Otra')).toBeNull();
  });

  it('Alt+A opens the register from the filter; while it is open, list shortcuts do not fire', async () => {
    const { user, service } = mount({ add: true, refresh: true });
    await screen.findByText('ALFA');
    await user.click(screen.getByLabelText('Filtro'));
    await user.keyboard('{Alt>}a{/Alt}');
    expect(await screen.findByText('Nuevo: Otra')).toBeTruthy();

    fireEvent.keyDown(screen.getByLabelText('Filtro'), { altKey: true, code: 'KeyR' });
    expect(service.list).toHaveBeenCalledTimes(1);
  });
});

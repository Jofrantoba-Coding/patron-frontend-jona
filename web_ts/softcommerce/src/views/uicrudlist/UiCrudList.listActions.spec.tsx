import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import type { ActionConfig, CatalogConfig } from '../../catalogs/CatalogConfig';
import { DENY_ALL } from '../../domain/permissions';
import type { InterCatalogService } from '../../services/InterCatalogService';
import { DialogStackProvider } from '../uishell/DialogStackProvider';
import { UiCrudList } from './UiCrudList';

interface Row { id: string; name: string }
const config: CatalogConfig<Row> = { formId: 'f', title: 'Prueba', catalog: 'prueba', idKey: 'id', columns: [{ key: 'name', header: 'Nombre' }], fields: [] };
const service = { list: async () => ({ items: [{ id: '1', name: 'ALFA' }], pagination: { page: 1, pageSize: 1000, total: 1 } }) } as unknown as InterCatalogService<Row>;
const action: ActionConfig = { id: 'abrir', label: 'Abrir Panel', placement: 'list-toolbar', flag: 'modify', kind: 'deferred', rule: 'abrir' };
const Panel = ({ row, onClose }: { row: Row; onClose: () => void }) => <button onClick={onClose}>Panel de {row.name}</button>;

function open(modify = true) {
  render(
    <DialogStackProvider>
      <UiCrudList config={config} service={service} permissions={{ ...DENY_ALL, modify }} listActions={[action]} panels={{ abrir: Panel }} />
    </DialogStackProvider>,
  );
  return userEvent.setup();
}

describe('list-toolbar actions (R-ACT-1, R-PRM-6)', () => {
  it('S-PRM-10 pressed with no selected row shows the Aviso notice and opens no panel', async () => {
    const user = open();
    await screen.findByText('ALFA');
    await user.click(screen.getByRole('button', { name: 'Abrir Panel' }));
    expect(await screen.findByText('Seleccione un registro de la tabla')).toBeTruthy();
    expect(screen.getByText('Aviso')).toBeTruthy();
    expect(screen.queryByRole('button', { name: /Panel de/ })).toBeNull();
  });

  it('opens the named panel on the selected row and closes it', async () => {
    const user = open();
    await user.click(await screen.findByText('ALFA'));
    await user.click(screen.getByRole('button', { name: 'Abrir Panel' }));
    await user.click(await screen.findByRole('button', { name: 'Panel de ALFA' }));
    expect(screen.queryByRole('button', { name: /Panel de/ })).toBeNull();
  });

  it('is disabled when the declared flag is not granted', async () => {
    open(false);
    await screen.findByText('ALFA');
    expect((screen.getByRole('button', { name: 'Abrir Panel' }) as HTMLButtonElement).disabled).toBe(true);
  });
});

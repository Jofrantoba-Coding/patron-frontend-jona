import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { validateRegistry } from '../../../mock-server/registry/schema.js';
import { toCatalogConfig } from '../../catalogs/registry';
import { PERMISSION_FLAGS, type Permissions } from '../../domain/permissions';
import { ServicesProvider } from '../../services/ServicesContext';
import { createAppServicesMock } from '../../services/mock/AppServicesMock';
import { seed } from '../../services/mock/seed';
import { DialogStackProvider } from '../uishell/DialogStackProvider';
import { UiCatalog } from './UiCatalog';

const registry = validateRegistry([
  {
    slug: 'cosas', idKey: 'id_cosa', codeWidth: 3, entity: 'un Cosa', scope: 'tenant', seed: 'cosas', stamp: ['id_usuario'], formId: 'miCosa', title: 'Cosa', messages: { style: 'M1' },
    fields: [{ name: 'id_cosa', kind: 'code', label: 'Código' }, { name: 'descripcion', kind: 'text', label: 'Descripción', required: true, max: 100, msgLabel: 'su Descripcion' }],
    columns: [{ key: 'descripcion', header: 'Descripción' }],
    children: {
      notas: {
        tab: 'Notas', fields: [{ name: 'texto', kind: 'text', label: 'Texto', max: 20 }], columns: [{ key: 'texto', header: 'Texto' }],
        actions: [{ id: 'marcar', label: 'Marcar', kind: 'deferred', rule: 'marcar', flag: 'add' }],
      },
    },
  },
]);
const granted = Object.fromEntries(PERMISSION_FLAGS.map((f) => [f, true])) as Permissions;

async function openUpdate(permissions: Permissions) {
  const services = createAppServicesMock('exitoso', {
    getSession: () => ({ tenantId: 'demo' }), getRequestContext: () => ({ userId: '1' }), delayMs: 0, registry, seed: { ...seed, cosas: { demo: [{ id_cosa: '001', descripcion: 'ALFA', activo: true }] } },
  });
  const user = userEvent.setup();
  render(
    <ServicesProvider services={services}>
      <DialogStackProvider>
        <UiCatalog config={toCatalogConfig(registry.entries[0], registry)} permissions={permissions} />
      </DialogStackProvider>
    </ServicesProvider>,
  );
  await user.click(await screen.findByText('ALFA'));
  await user.click(screen.getByRole('button', { name: 'Modificar' }));
  await user.click(await screen.findByRole('tab', { name: 'Notas' }));
  return within(screen.getByRole('tabpanel', { name: 'Notas', hidden: true })).getByRole('button', { name: 'Marcar' }) as HTMLButtonElement;
}

describe('S-ACT-2 the list hands the form permissions to the master register', () => {
  it('an action is gated by its declared flag of the form, not by the flag that opened the register', async () => {
    expect((await openUpdate({ ...granted, add: false })).disabled).toBe(true);
  });

  it('the same action is enabled when its flag is granted', async () => {
    expect((await openUpdate(granted)).disabled).toBe(false);
  });
});

import { render, screen } from '@testing-library/react';
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

const entry = (over: Record<string, any>) => ({
  slug: 'cosas', idKey: 'id_cosa', codeWidth: 3, entity: 'un Cosa', scope: 'tenant', seed: 'cosas', stamp: ['id_usuario'], formId: 'miCosa', title: 'Cosa', messages: { style: 'M1' },
  fields: [{ name: 'id_cosa', kind: 'code', label: 'Código' }, { name: 'descripcion', kind: 'text', label: 'Descripción', required: true, max: 100, msgLabel: 'su Descripcion' }],
  columns: [{ key: 'descripcion', header: 'Descripción' }], ...over,
});
const granted = Object.fromEntries(PERMISSION_FLAGS.map((f) => [f, true])) as Permissions;

async function openRegister(over: Record<string, any>) {
  const registry = validateRegistry([entry(over)]);
  const services = createAppServicesMock('exitoso', {
    getSession: () => ({ tenantId: 'demo' }), getRequestContext: () => ({ userId: '1' }), delayMs: 0, registry, seed: { ...seed, cosas: { demo: [{ id_cosa: '001', descripcion: 'ALFA', activo: true }] } },
  });
  const user = userEvent.setup();
  render(
    <ServicesProvider services={services}>
      <DialogStackProvider>
        <UiCatalog config={toCatalogConfig(registry.entries[0], registry)} permissions={granted} />
      </DialogStackProvider>
    </ServicesProvider>,
  );
  await screen.findByText('ALFA');
  await user.click(screen.getByRole('button', { name: 'Agregar' }));
  await screen.findByLabelText('Descripción');
}

describe('UiCatalog register choice (D10)', () => {
  it('opens the master register, with a tab per child, when the config declares children', async () => {
    await openRegister({ children: { notas: { tab: 'Notas', fields: [{ name: 'texto', kind: 'text', label: 'Texto', max: 20 }], columns: [{ key: 'texto', header: 'Texto' }] } } });
    expect(screen.getAllByRole('tab').map((t) => t.textContent)).toEqual(['General', 'Notas']);
  });

  it('keeps the generic register, with no tabs, for a catalog without children', async () => {
    await openRegister({});
    expect(screen.queryAllByRole('tab')).toHaveLength(0);
  });
});

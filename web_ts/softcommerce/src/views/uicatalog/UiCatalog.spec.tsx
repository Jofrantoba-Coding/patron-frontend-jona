import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { validateRegistry } from '../../../mock-server/registry/schema.js';
import { toCatalogConfig } from '../../catalogs/registry';
import { PERMISSION_FLAGS, type Permissions } from '../../domain/permissions';
import { ServicesProvider } from '../../services/ServicesContext';
import { createAppServicesMock } from '../../services/mock/AppServicesMock';
import { seed } from '../../services/mock/seed';
import { DialogStackProvider } from '../uishell/DialogStackProvider';
import { UICATALOG_DEFAULTS } from './InterUiCatalog';
import { UiCatalog } from './UiCatalog';

const registry = validateRegistry([
  {
    slug: 'cosas', idKey: 'id_cosa', codeWidth: 3, entity: 'un Cosa', scope: 'tenant', seed: 'cosas', stamp: ['id_usuario'],
    formId: 'miCosa', title: 'Cosa', messages: { style: 'M1' },
    fields: [
      { name: 'id_cosa', kind: 'code', label: 'Código' },
      { name: 'descripcion', kind: 'text', label: 'Descripción', required: true, max: 100, msgLabel: 'su Descripcion', normalize: ['upper'] },
    ],
    columns: [{ key: 'id_cosa', header: 'Código' }, { key: 'descripcion', header: 'Descripción' }],
  },
]);
const config = toCatalogConfig(registry.entries[0]);
const granted = Object.fromEntries(PERMISSION_FLAGS.map((f) => [f, true])) as Permissions;
const rows = [
  { id_cosa: '001', descripcion: 'ALFA', activo: true },
  { id_cosa: '002', descripcion: 'OCULTO', activo: false },
];

function renderCatalog(scenario: 'exitoso' | 'errorServidor' = 'exitoso', data: unknown[] = rows) {
  const services = createAppServicesMock(scenario, {
    getSession: () => ({ tenantId: 'demo' }), getRequestContext: () => ({ userId: '1' }), delayMs: 0, registry,
    seed: { ...seed, cosas: { demo: data } },
  });
  render(
    <ServicesProvider services={services}>
      <DialogStackProvider>
        <UiCatalog config={config} permissions={granted} />
      </DialogStackProvider>
    </ServicesProvider>,
  );
  return userEvent.setup();
}

describe('UiCatalog (G15 generic unit)', () => {
  it('S-REF-1 lists the active rows with code and descripcion and hides the inactive ones', async () => {
    renderCatalog();
    expect(await screen.findByText('ALFA')).toBeTruthy();
    expect(screen.getByText('001')).toBeTruthy();
    expect(screen.queryByText('OCULTO')).toBeNull();
  });

  it('S-REF-2 / S-CRUD-34 adds a record: blank submit shows the desktop message, the server issues the code', async () => {
    const user = renderCatalog();
    await screen.findByText('ALFA');
    await user.click(screen.getByRole('button', { name: 'Agregar' }));
    await screen.findByLabelText('Descripción');
    expect(screen.queryByLabelText('Código')).toBeNull();
    await user.click(screen.getByRole('button', { name: 'Aceptar' }));
    expect(screen.getByText('Para agregar un Cosa, debes especificar su Descripcion.')).toBeTruthy();

    await user.type(screen.getByLabelText('Descripción'), 'beta');
    await user.click(screen.getByRole('button', { name: 'Aceptar' }));
    await user.click(screen.getByRole('button', { name: 'Confirmar' }));
    expect(await screen.findByText('BETA')).toBeTruthy();
    expect(screen.getByText('003')).toBeTruthy();
  });

  it('keeps the list states: empty and server error with retry', async () => {
    renderCatalog('exitoso', []);
    expect(await screen.findByText('No hay registros.')).toBeTruthy();
  });

  it('shows the server error with a retry button', async () => {
    renderCatalog('errorServidor');
    expect(await screen.findByRole('alert')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Reintentar' })).toBeTruthy();
  });

  it('uses the mobile-first floors on its buttons', async () => {
    renderCatalog();
    await screen.findByText('ALFA');
    await waitFor(() => expect(screen.getByRole('button', { name: 'Agregar' }).className).toContain('min-h-11 sm:min-h-9'));
  });

  it('DEFAULTS are presentation only: strings, no state values', () => {
    expect(Object.values(UICATALOG_DEFAULTS).every((value) => typeof value === 'string')).toBe(true);
    expect(Object.keys(UICATALOG_DEFAULTS)).toEqual(['className']);
  });
});

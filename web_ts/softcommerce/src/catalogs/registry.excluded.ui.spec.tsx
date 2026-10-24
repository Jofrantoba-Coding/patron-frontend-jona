import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { REGISTRY } from '../../mock-server/registry/index.js';
import { PERMISSION_FLAGS, type Permissions } from '../domain/permissions';
import { ServicesProvider } from '../services/ServicesContext';
import { createAppServicesMock } from '../services/mock/AppServicesMock';
import { seed } from '../services/mock/seed';
import { UiCatalog } from '../views/uicatalog';
import { DialogStackProvider } from '../views/uishell/DialogStackProvider';
import { formRegistry } from '../views/uishell/formRegistry';
import { toCatalogConfig } from './registry';

const session = () => ({ tenantId: 'demo' });
const ctx = { userId: '7', empresaId: '1' };

// S-REF-39: the excluded desktop behaviors (R-REF-12) do not appear on the register of the five catalogs that had them.
const granted = Object.fromEntries(PERMISSION_FLAGS.map((f) => [f, true])) as Permissions;
/** Texts of the excluded panels and fields; a nested-create button reads `Nueva ...` / `Crear ...` (the dialog title `Nuevo: ...` is not one). */
const EXCLUDED = /activaci|presentaci|propietario|unidad base|percepci|retenci|exceptuado/i;
const NESTED_CREATE = /nuev[ao]|crear|activar|desactivar/i;

describe('S-REF-39 excluded behaviors are absent from the register', () => {
  it.each(['subfamilias', 'tipos-cambio', 'unidades-medida', 'vehiculos'])('%s shows no nested-create button, activation tab, presentation panel or propietario picker', async (slug) => {
    const services = createAppServicesMock('exitoso', { getSession: session, getRequestContext: () => ctx, delayMs: 0, seed });
    render(
      <ServicesProvider services={services}>
        <DialogStackProvider>
          <UiCatalog config={toCatalogConfig(REGISTRY.bySlug.get(slug))} permissions={granted} />
        </DialogStackProvider>
      </ServicesProvider>,
    );
    const user = userEvent.setup();
    await waitFor(() => expect(screen.queryByText('Cargando...')).toBeNull());
    await user.click(await screen.findByRole('button', { name: 'Agregar' }));
    const dialog = await screen.findByRole('dialog');
    await waitFor(() => expect(within(dialog).queryByText('Cargando...')).toBeNull());
    expect(within(dialog).queryAllByRole('button').map((b) => b.textContent).filter((t) => EXCLUDED.test(t ?? '') || NESTED_CREATE.test(t ?? ''))).toEqual([]);
    expect(within(dialog).queryAllByRole('tab')).toEqual([]);
    expect(within(dialog).queryByText(EXCLUDED)).toBeNull();
  });
});

describe('S-REF-36 every catalog is reachable from the menu', () => {
  it('the form registry maps the formId of each writable catalog, and Localidad keeps its own unit', () => {
    for (const entry of (REGISTRY.entries as any[]).filter((e) => !e.readOnly && !e.compat)) expect(formRegistry[entry.formId], entry.slug).toBeTypeOf('function');
    expect(formRegistry.mi_localidad).toBeTypeOf('function');
  });
});

// @vitest-environment jsdom
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { REGISTRY } from '../../mock-server/registry/index.js';
import { toCatalogConfig } from '../../src/catalogs/registry';
import { PERMISSION_FLAGS, type Permissions } from '../../src/domain/permissions';
import { ServicesProvider } from '../../src/services/ServicesContext';
import { createAppServicesMock } from '../../src/services/mock/AppServicesMock';
import { seed } from '../../src/services/mock/seed';
import { UiCatalog } from '../../src/views/uicatalog';
import { DialogStackProvider } from '../../src/views/uishell/DialogStackProvider';

const session = () => ({ tenantId: 'demo' });
const WRITER = { userId: '7', empresaId: '1' };
const entry = REGISTRY.bySlug.get('choferes');

const granted = Object.fromEntries(PERMISSION_FLAGS.map((f) => [f, true])) as Permissions;
describe('S-REF-40 / S-ANX-15 the register shows the Activación de Chofer tab', () => {
  it('UPDATE lists the seeded INICIO row; Desactivar with a motivo closes it and unchecks Estado; the toolbar has no Eliminar', async () => {
    const services = createAppServicesMock('exitoso', { getSession: session, getRequestContext: () => WRITER, delayMs: 0, seed });
    render(
      <ServicesProvider services={services}>
        <DialogStackProvider>
          <UiCatalog config={toCatalogConfig(entry)} permissions={granted} />
        </DialogStackProvider>
      </ServicesProvider>,
    );
    const user = userEvent.setup();
    await user.click(await screen.findByText('RAMOS DIAZ LUIS'));
    expect(screen.queryByRole('button', { name: 'Eliminar' })).toBeNull();
    await user.click(screen.getByRole('button', { name: 'Modificar' }));
    await screen.findByLabelText('Tipo de Documento');
    const estado = () => screen.getByLabelText('Estado') as HTMLInputElement;
    await waitFor(() => expect(estado().checked).toBe(true));
    await user.click(screen.getByRole('tab', { name: 'Activación de Chofer' }));
    const panel = () => screen.getByRole('tabpanel', { name: 'Activación de Chofer' });
    const rows = () => within(panel()).getAllByRole('row').slice(1).map((tr) => within(tr).getAllByRole('cell').map((td) => td.textContent));
    await waitFor(() => expect(rows()).toHaveLength(1));
    expect(rows()[0].slice(0, 2)).toEqual(['●', 'INICIO']);
    await user.click(screen.getByText('INICIO'));
    await user.click(within(panel()).getByRole('button', { name: 'Desactivar' }));
    const dialog = await waitFor(() => screen.getByText('Nuevo: Desactivar Chofer').closest<HTMLElement>('[role="dialog"]') as HTMLElement);
    await user.type(within(dialog).getByLabelText('Motivo de Desactivacion'), 'cese');
    await user.click(within(dialog).getByRole('button', { name: 'Aceptar' }));
    await user.click((await screen.findAllByRole('button', { name: 'Confirmar' })).at(-1) as HTMLElement);
    expect(rows()[0].slice(0, 2)).toEqual(['○', 'INICIO']);
    await user.click(screen.getByRole('tab', { name: 'General' }));
    expect(estado().checked).toBe(false);
  });
});

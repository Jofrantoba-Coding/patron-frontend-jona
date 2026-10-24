// @vitest-environment jsdom
import { cleanup, render, screen, waitFor, within } from '@testing-library/react';
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

/** S-PRM-14 / R-PRM-7: Autorizar Series and the W2 UsuarioCorrelativo screen read and write the SAME rows (one in-browser store, two screens). */
const granted = Object.fromEntries(PERMISSION_FLAGS.map((f) => [f, true])) as Permissions;
const services = createAppServicesMock('exitoso', { getSession: () => ({ tenantId: 'demo' }), getRequestContext: () => ({ userId: '7', empresaId: '1' }), delayMs: 0, seed });
const user = userEvent.setup();

/** Mounts one screen over the shared services, replacing the previous one. */
function show(slug: 'usuarios' | 'usuario-correlativos') {
  cleanup();
  render(
    <ServicesProvider services={services}>
      <DialogStackProvider>
        <UiCatalog config={toCatalogConfig(REGISTRY.bySlug.get(slug))} permissions={granted} />
      </DialogStackProvider>
    </ServicesProvider>,
  );
}
const panel = () => screen.getAllByRole('dialog')[0];
const top = () => screen.getAllByRole('dialog').at(-1) as HTMLElement;
const choose = async (label: string, text: string) => {
  const select = () => within(top()).getByLabelText(label) as HTMLSelectElement;
  await waitFor(() => expect([...select().options].map((o) => o.textContent)).toContain(text));
  await user.selectOptions(select(), text);
};

/** The W2 row of the new authorization: Administrador with the serie F001. */
const w2Row = async () => {
  await screen.findAllByText('F001');
  return screen.getAllByRole('row').find((row) => row.textContent?.includes('Administrador') && row.textContent.includes('F001')) as HTMLElement;
};

async function openAutorizar() {
  show('usuarios');
  await user.click(await screen.findByText('Administrador'));
  await user.click(screen.getByRole('button', { name: 'Autorizar Series' }));
  await screen.findByText('Trabajador:');
}

describe('S-PRM-14 one store for both screens', () => {
  it('an authorization made in Autorizar Series is a habilitar row of the W2 list; habilitar false there shows deactivated here; a W2 logical delete removes it here', async () => {
    await openAutorizar();
    await user.click(within(panel()).getByRole('button', { name: 'Activar' }));
    await waitFor(() => expect(screen.getAllByRole('dialog')).toHaveLength(2));
    await choose('Punto de Venta', 'TIENDA CENTRAL');
    await choose('Tipo de Documento', 'FACTURA');
    await choose('Serie', 'F001');
    await user.click(within(top()).getByRole('button', { name: 'Guardar' }));
    await user.click(await screen.findByRole('button', { name: 'Aceptar' }));
    expect((await within(panel()).findAllByText('Activo')).length).toBe(1);

    // The W2 screen lists it (Administrador, F001) and its Habilitar is on.
    show('usuario-correlativos');
    await user.click(await w2Row());
    await user.click(screen.getByRole('button', { name: 'Modificar' }));
    const habilitar = await screen.findByRole('checkbox', { name: 'Habilitar' });
    await waitFor(() => expect((screen.getByLabelText('Serie') as HTMLSelectElement).selectedOptions[0]?.textContent).toBe('F001'));
    expect((habilitar as HTMLInputElement).checked).toBe(true);

    // Habilitar off in W2 -> deactivated in the panel.
    await user.click(habilitar);
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Aceptar' }));
    await user.click(await screen.findByRole('button', { name: 'Confirmar' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await openAutorizar();
    // The seeded F002 row of the same usuario is already deactivated, so there are two.
    expect(await within(panel()).findAllByText('Desactivado')).toHaveLength(2);
    expect(within(panel()).getByText('F001')).toBeTruthy();

    // A W2 logical delete removes it from the panel.
    show('usuario-correlativos');
    await user.click(await w2Row());
    await user.click(screen.getByRole('button', { name: 'Eliminar' }));
    await user.click(within(await screen.findByRole('dialog')).getByRole('button', { name: 'Aceptar' }));
    await user.click(await screen.findByRole('button', { name: 'Confirmar' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await openAutorizar();
    await waitFor(() => expect(within(panel()).queryByText('F001')).toBeNull());
    expect(within(panel()).getAllByText('Desactivado')).toHaveLength(1);
  });
});

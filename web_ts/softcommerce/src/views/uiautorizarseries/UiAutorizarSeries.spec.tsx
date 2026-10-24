import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { REGISTRY } from '../../../mock-server/registry/index.js';
import { toCatalogConfig } from '../../catalogs/registry';
import { PERMISSION_FLAGS, type Permissions } from '../../domain/permissions';
import { ServicesProvider } from '../../services/ServicesContext';
import { createAppServicesMock } from '../../services/mock/AppServicesMock';
import { seed } from '../../services/mock/seed';
import { UiCatalog } from '../uicatalog';
import { DialogStackProvider } from '../uishell/DialogStackProvider';

const granted = Object.fromEntries(PERMISSION_FLAGS.map((f) => [f, true])) as Permissions;
const LITERAL = 'Ya existe una asignacion del documento con la serie elegida al mismo usuario, por favor elija otra serie u otro usuario disponible.';

/** The real Usuario list over the in-browser mock, acting in empresa 1. */
export function renderUsuarios() {
  const services = createAppServicesMock('exitoso', { getSession: () => ({ tenantId: 'demo' }), getRequestContext: () => ({ userId: '7', empresaId: '1' }), delayMs: 0, seed });
  render(
    <ServicesProvider services={services}>
      <DialogStackProvider>
        <UiCatalog config={toCatalogConfig(REGISTRY.bySlug.get('usuarios'))} permissions={granted} />
      </DialogStackProvider>
    </ServicesProvider>,
  );
  return { user: userEvent.setup(), services };
}
type User = ReturnType<typeof userEvent.setup>;
const panel = () => screen.getAllByRole('dialog')[0];
const top = () => screen.getAllByRole('dialog').at(-1) as HTMLElement;
const select = (label: string) => within(top()).getByLabelText(label) as HTMLSelectElement;
const choose = async (user: User, label: string, text: string) => {
  await waitFor(() => expect([...select(label).options].map((o) => o.textContent)).toContain(text));
  await user.selectOptions(select(label), text);
};

export async function openPanel(user: User, nombre: string) {
  await user.click(await screen.findByText(nombre));
  await user.click(screen.getByRole('button', { name: 'Autorizar Series' }));
  await screen.findByText('Trabajador:');
}
const openActivar = async (user: User) => {
  await user.click(within(panel()).getByRole('button', { name: 'Activar' }));
  await waitFor(() => expect(screen.getAllByRole('dialog')).toHaveLength(2));
};
const fill = async (user: User, pv: string, tipo: string, serie: string) => {
  await choose(user, 'Punto de Venta', pv);
  await choose(user, 'Tipo de Documento', tipo);
  await choose(user, 'Serie', serie);
};

describe('S-PRM-10 the panel opens from the Usuario toolbar', () => {
  it('refuses with no selected usuario', async () => {
    const { user } = renderUsuarios();
    await screen.findByText('Cajero Uno');
    await user.click(screen.getByRole('button', { name: 'Autorizar Series' }));
    expect(await screen.findByText('Seleccione un registro de la tabla')).toBeTruthy();
    expect(screen.getByText('Aviso')).toBeTruthy();
    expect(screen.queryByText('Trabajador:')).toBeNull();
  });

  it('shows the trabajador, the usuario and the grid of that usuario series', async () => {
    const { user } = renderUsuarios();
    await openPanel(user, 'Cajero Uno');
    const view = within(panel());
    expect(view.getByText('cajero')).toBeTruthy();
    expect((await view.findAllByText('Activo')).length).toBe(2);
    for (const text of ['F001', 'T001', 'TIENDA CENTRAL', 'FACTURA', '05/01/2026']) expect(view.getAllByText(text).length).toBeGreaterThan(0);
  });
});

describe('S-PRM-11 / S-PRM-12 Activar', () => {
  it('chains the selects, fills the read-only Id Correlativo and creates the authorization', async () => {
    const { user } = renderUsuarios();
    await openPanel(user, 'Administrador');
    await openActivar(user);
    expect(within(top()).getByText('Fecha de Inicio')).toBeTruthy();
    await fill(user, 'TIENDA CENTRAL', 'FACTURA', 'F001');
    const id = within(top()).getByLabelText('Id Correlativo') as HTMLInputElement;
    expect([id.value, id.readOnly]).toEqual(['00001', true]);
    await user.click(within(top()).getByRole('button', { name: 'Guardar' }));
    expect(await screen.findByText('Serie autorizada')).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'Aceptar' }));
    expect(screen.getAllByRole('dialog')).toHaveLength(1);
    expect((await within(panel()).findAllByText('F001')).length).toBe(1);
  });

  it('changing the punto de venta clears the serie and the id; a pair with no series says so', async () => {
    const { user } = renderUsuarios();
    await openPanel(user, 'Administrador');
    await openActivar(user);
    await fill(user, 'TIENDA CENTRAL', 'FACTURA', 'F001');
    await choose(user, 'Punto de Venta', 'TIENDA MIRAFLORES');
    expect((within(top()).getByLabelText('Id Correlativo') as HTMLInputElement).value).toBe('');
    await choose(user, 'Tipo de Documento', 'BOLETA DE VENTA');
    expect(await within(top()).findByText('No existe serie para esa combinacion')).toBeTruthy();
  });

  it('S-ACT-9 / S-PRM-15 a duplicate active pair is a 409 with the W2 sentence: the dialog stays open and the grid is unchanged', async () => {
    const { user } = renderUsuarios();
    await openPanel(user, 'Cajero Uno');
    await openActivar(user);
    await fill(user, 'TIENDA CENTRAL', 'FACTURA', 'F001');
    await user.click(within(top()).getByRole('button', { name: 'Guardar' }));
    expect(await within(top()).findByText(LITERAL)).toBeTruthy();
    expect(screen.getAllByRole('dialog')).toHaveLength(2);
    expect(within(panel()).getAllByText('F001')).toHaveLength(1);
  });
});

describe('S-PRM-13 Desactivar', () => {
  it('needs a selected row', async () => {
    const { user } = renderUsuarios();
    await openPanel(user, 'Cajero Uno');
    await user.click(within(panel()).getByRole('button', { name: 'Desactivar' }));
    expect(await screen.findByText('Seleccione un registro de la tabla')).toBeTruthy();
    expect(screen.getByText('Aviso')).toBeTruthy();
  });

  it('turns the selected row deactivated with fecha fin today and reloads', async () => {
    const { user } = renderUsuarios();
    await openPanel(user, 'Cajero Uno');
    await user.click(await within(panel()).findByText('F001'));
    await user.click(within(panel()).getByRole('button', { name: 'Desactivar' }));
    expect(await screen.findByText('Serie desactivada')).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'Aceptar' }));
    expect(await within(panel()).findAllByText('Desactivado')).toHaveLength(1);
  });
});

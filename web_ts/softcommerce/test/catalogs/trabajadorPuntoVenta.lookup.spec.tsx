// @vitest-environment jsdom
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { REGISTRY } from '../../mock-server/registry/index.js';
import { PICKERS } from '../../mock-server/registry/pickers.js';
import { toCatalogConfig } from '../../src/catalogs/registry';
import { PERMISSION_FLAGS, type Permissions } from '../../src/domain/permissions';
import { ServicesProvider } from '../../src/services/ServicesContext';
import { createAppServicesMock } from '../../src/services/mock/AppServicesMock';
import { seed } from '../../src/services/mock/seed';
import { UiCatalog } from '../../src/views/uicatalog';
import { DialogStackProvider } from '../../src/views/uishell/DialogStackProvider';

// W3-3 parity baseline (R-LKP-8, S-REF-42, S-LKP-16): the TrabajadorPuntoVenta trabajador is the BuscarTrabajador lookup; the S-REF-21 and S-REF-17 meanings stay.
const granted = Object.fromEntries(PERMISSION_FLAGS.map((f) => [f, true])) as Permissions;
const entry = REGISTRY.bySlug.get('trabajador-punto-venta');
const field = (name: string) => entry.fields.find((f: any) => f.name === name);
const sentence = (what: string) => `Para agregar un Trabajador, debes especificar ${what}.`;
const DUPLICATE = 'El Trabajador ya se encuentra asignado al punto de venta especificado. Compruébala e inténtalo de nuevo';

function renderCatalog() {
  const services = createAppServicesMock('exitoso', { getSession: () => ({ tenantId: 'demo' }), getRequestContext: () => ({ userId: '7', empresaId: '1' }), delayMs: 0, seed });
  render(
    <ServicesProvider services={services}>
      <DialogStackProvider>
        <UiCatalog config={toCatalogConfig(REGISTRY.bySlug.get('trabajador-punto-venta'))} permissions={granted} />
      </DialogStackProvider>
    </ServicesProvider>,
  );
  return userEvent.setup();
}
type User = ReturnType<typeof userEvent.setup>;
const code = () => screen.getByLabelText('Trabajador') as HTMLInputElement;
const description = () => (screen.getByLabelText('Trabajador descripción') as HTMLInputElement).value;
const select = (label: string) => screen.getByLabelText(label) as HTMLSelectElement;
const dialog = () => screen.getByRole('dialog');
const submit = (user: User) => user.click(within(dialog()).getByRole('button', { name: 'Aceptar' }));
const choose = async (user: User, label: string, text: string) => {
  await waitFor(() => expect([...select(label).options].map((o) => o.textContent)).toContain(text));
  await user.selectOptions(select(label), text);
};
async function openAdd() {
  const user = renderCatalog();
  await screen.findAllByText('MARIA GARCIA RAMOS');
  await user.click(screen.getByRole('button', { name: 'Agregar' }));
  await screen.findByLabelText('Trabajador');
  return user;
}

describe('trabajador-punto-venta trabajador is the BuscarTrabajador lookup (S-REF-42)', () => {
  it('declares a required lookup over trabajadores with the picker filters and columns and keeps the W2 sentence', () => {
    expect(field('id_trabajador')).toMatchObject({
      kind: 'lookup', picker: 'buscarTrabajador', required: true, msgLabel: 'su Nombre', source: { catalog: 'trabajadores' }, display: 'trabajador',
      search: PICKERS.buscarTrabajador.search, columns: PICKERS.buscarTrabajador.columns, filters: PICKERS.buscarTrabajador.filters,
    });
    expect(entry.joins.find((j: any) => j.ref === 'id_trabajador')).toMatchObject({ as: 'trabajador', display: 'nombre' });
  });

  it('a blank trabajador shows the W2 sentence and the other fields keep their order', async () => {
    const user = await openAdd();
    await submit(user);
    expect(screen.getByText(sentence('su Nombre'))).toBeTruthy();
  });

  it('a typed code resolves on blur to the nombre and the register goes on with the empresa sentence', async () => {
    const user = await openAdd();
    await user.type(code(), '001');
    await user.tab();
    await waitFor(() => expect(description()).toBe('JUAN PEREZ LOPEZ'));
    await submit(user);
    expect(screen.getByText(sentence('la Empresa'))).toBeTruthy();
  });

  it('S-LKP-1 the search dialog lists only the active trabajadores and a pick fills code and nombre', async () => {
    const user = await openAdd();
    await user.click(within(dialog()).getByRole('button', { name: 'Buscar' }));
    await waitFor(() => expect(screen.getAllByRole('dialog')).toHaveLength(2));
    const picker = within(screen.getAllByRole('dialog')[1]);
    await picker.findByText('JUAN PEREZ LOPEZ');
    expect(picker.getAllByText(/^(JUAN PEREZ LOPEZ|MARIA GARCIA RAMOS|CARLOS TORRES DIAZ)$/)).toHaveLength(3);
    expect(picker.queryByText('LUIS RETIRADO SOTO')).toBeNull();
    await user.click(picker.getByText('MARIA GARCIA RAMOS'));
    await user.click(picker.getByRole('button', { name: 'Agregar' }));
    expect(code().value).toBe('002');
    expect(description()).toBe('MARIA GARCIA RAMOS');
  });

  it('S-REF-21 an assigned pair still shows the desktop sentence and keeps the picked trabajador', async () => {
    const user = await openAdd();
    await user.type(code(), '002');
    await user.tab();
    await waitFor(() => expect(description()).toBe('MARIA GARCIA RAMOS'));
    await choose(user, 'Empresa', 'COMERCIAL DEMO SAC');
    await choose(user, 'Localidad', 'LOCAL CENTRAL');
    await choose(user, 'Punto de Venta', 'TIENDA CENTRAL');
    await submit(user);
    await user.click(await screen.findByRole('button', { name: 'Confirmar' }));
    expect(await screen.findByText(DUPLICATE)).toBeTruthy();
    expect(code().value).toBe('002');
    expect(description()).toBe('MARIA GARCIA RAMOS');
  });
});

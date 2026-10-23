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
import { toCatalogConfig } from './registry';

const granted = Object.fromEntries(PERMISSION_FLAGS.map((f) => [f, true])) as Permissions;

/** The real `trabajador-punto-venta` entry rendered over the demo seed (acting for user 7, empresa 1), against the in-browser mock. */
function renderCatalog() {
  const services = createAppServicesMock('exitoso', { getSession: () => ({ tenantId: 'demo' }), getRequestContext: () => ({ userId: '7', empresaId: '1' }), delayMs: 0, seed });
  render(
    <ServicesProvider services={services}>
      <DialogStackProvider>
        <UiCatalog config={toCatalogConfig(REGISTRY.bySlug.get('trabajador-punto-venta'))} permissions={granted} />
      </DialogStackProvider>
    </ServicesProvider>,
  );
  return { user: userEvent.setup(), services };
}
type User = ReturnType<typeof userEvent.setup>;
const select = (label: string) => screen.getByLabelText(label) as HTMLSelectElement;
const dialog = () => screen.getByRole('dialog');
const options = (label: string) => [...select(label).options].map((o) => o.textContent);
const shown = (label: string) => select(label).selectedOptions[0]?.textContent;
const submit = (user: User) => user.click(within(dialog()).getByRole('button', { name: 'Aceptar' }));
const choose = async (user: User, label: string, text: string) => {
  await waitFor(() => expect(options(label)).toContain(text));
  await user.selectOptions(select(label), text);
};
const sentence = (what: string) => `Para agregar un Trabajador, debes especificar ${what}.`;
const DUPLICATE = 'El Trabajador ya se encuentra asignado al punto de venta especificado. Compruébala e inténtalo de nuevo';

async function openAdd() {
  const rendered = renderCatalog();
  await screen.findAllByText('MARIA GARCIA RAMOS');
  await rendered.user.click(screen.getByRole('button', { name: 'Agregar' }));
  await screen.findByLabelText('Trabajador');
  return rendered;
}
async function fillChain(user: User, trabajador: string) {
  await choose(user, 'Trabajador', trabajador);
  await choose(user, 'Empresa', 'COMERCIAL DEMO SAC');
  await choose(user, 'Localidad', 'LOCAL CENTRAL');
  await choose(user, 'Punto de Venta', 'TIENDA CENTRAL');
}

describe('trabajador-punto-venta register (S-REF-21)', () => {
  it('lists the active assignments with the joined names and the habilitado flag', async () => {
    renderCatalog();
    // The assignment of the same trabajador in the other empresa is listed too: the list is tenant-wide.
    expect((await screen.findAllByText('MARIA GARCIA RAMOS')).length).toBe(2);
    expect(screen.getByText('CARLOS TORRES DIAZ')).toBeTruthy();
    expect(screen.queryByText('LUIS RETIRADO SOTO')).toBeNull();
    expect(screen.getAllByText('COMERCIAL DEMO SAC').length).toBeGreaterThan(0);
  });

  it('INSERT offers the active trabajadores and every empresa, starts Habilitar unchecked and blocks the chain below the empresa', async () => {
    await openAdd();
    await waitFor(() => expect(options('Trabajador')).toEqual(['--- Seleccione ---', 'JUAN PEREZ LOPEZ', 'MARIA GARCIA RAMOS', 'CARLOS TORRES DIAZ']));
    await waitFor(() => expect(options('Empresa')).toEqual(['--- Seleccione ---', 'COMERCIAL DEMO SAC', 'DISTRIBUIDORA DEMO SRL']));
    expect((screen.getByRole('checkbox', { name: 'Habilitar' }) as HTMLInputElement).checked).toBe(false);
    expect([select('Localidad').disabled, select('Punto de Venta').disabled]).toEqual([true, true]);
  });

  it('the label sentences come one by one in the desktop order (the Trabajador, not the Correlativo of the desktop)', async () => {
    const { user } = await openAdd();
    await submit(user);
    expect(screen.getByText(sentence('su Nombre'))).toBeTruthy();
    await choose(user, 'Trabajador', 'JUAN PEREZ LOPEZ');
    await submit(user);
    expect(screen.getByText(sentence('la Empresa'))).toBeTruthy();
    await choose(user, 'Empresa', 'COMERCIAL DEMO SAC');
    await submit(user);
    expect(screen.getByText(sentence('la Localidad'))).toBeTruthy();
    await choose(user, 'Localidad', 'LOCAL CENTRAL');
    await submit(user);
    expect(screen.getByText(sentence('su Punto de Venta'))).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Confirmar' })).toBeNull();
  });

  it('S-REF-21 changing the empresa clears the localidad and the punto de venta and reloads the localidades of the new one', async () => {
    const { user } = await openAdd();
    await choose(user, 'Empresa', 'COMERCIAL DEMO SAC');
    await waitFor(() => expect(options('Localidad')).toEqual(['--- Seleccione ---', 'LOCAL CENTRAL', 'LOCAL ATE']));
    await choose(user, 'Localidad', 'LOCAL CENTRAL');
    await choose(user, 'Punto de Venta', 'TIENDA CENTRAL');
    await choose(user, 'Empresa', 'DISTRIBUIDORA DEMO SRL');
    expect([select('Localidad').value, select('Punto de Venta').value, select('Punto de Venta').disabled]).toEqual(['', '', true]);
    await waitFor(() => expect(options('Localidad')).toEqual(['--- Seleccione ---', 'ALMACEN CALLAO', 'SUCURSAL CUSCO']));
  });

  it('S-REF-21 an assigned pair shows the desktop sentence under Trabajador and keeps the values', async () => {
    const { user } = await openAdd();
    await fillChain(user, 'MARIA GARCIA RAMOS');
    await submit(user);
    await user.click(await screen.findByRole('button', { name: 'Confirmar' }));
    expect(await screen.findByText(DUPLICATE)).toBeTruthy();
    expect(shown('Trabajador')).toBe('MARIA GARCIA RAMOS');
    expect(shown('Punto de Venta')).toBe('TIENDA CENTRAL');
  });

  it('S-REF-21 habilitar untouched saves false, and the new assignment is listed', async () => {
    const { user, services } = await openAdd();
    await fillChain(user, 'JUAN PEREZ LOPEZ');
    await submit(user);
    await user.click(await screen.findByRole('button', { name: 'Confirmar' }));
    expect(await screen.findByText('JUAN PEREZ LOPEZ')).toBeTruthy();
    const saved = (await services.catalog<Record<string, unknown>>('trabajador-punto-venta').list()).items.find((r) => r.id_trabajador === '001');
    expect(saved).toMatchObject({ habilitar: false, id_punto_venta: '1' });
  });

  it('UPDATE restores trabajador, empresa, localidad and punto de venta, each with its options loaded', async () => {
    const { user } = renderCatalog();
    await user.click(await screen.findByText('CARLOS TORRES DIAZ'));
    await user.click(screen.getByRole('button', { name: 'Modificar' }));
    await screen.findByLabelText('Trabajador');
    await waitFor(() => expect([shown('Trabajador'), shown('Empresa'), shown('Localidad'), shown('Punto de Venta')]).toEqual(['CARLOS TORRES DIAZ', 'COMERCIAL DEMO SAC', 'LOCAL ATE', 'TIENDA MIRAFLORES']));
    expect((screen.getByRole('checkbox', { name: 'Habilitar' }) as HTMLInputElement).checked).toBe(false);
  });

  it('S-REF-21 CLONE keeping the pair is rejected [DEVIATION]', async () => {
    const { user } = renderCatalog();
    await user.click((await screen.findAllByText('MARIA GARCIA RAMOS'))[0]);
    await user.click(screen.getByRole('button', { name: 'Clonar' }));
    await screen.findByLabelText('Trabajador');
    await waitFor(() => expect(shown('Punto de Venta')).toBe('TIENDA CENTRAL'));
    await submit(user);
    await user.click(await screen.findByRole('button', { name: 'Confirmar' }));
    expect(await screen.findByText(DUPLICATE)).toBeTruthy();
  });
});

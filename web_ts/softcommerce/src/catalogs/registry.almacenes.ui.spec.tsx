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

/** The real `almacenes` and `zonas` entries rendered over the demo seed, acting for empresa 1. */
function renderCatalog(slug: string) {
  const services = createAppServicesMock('exitoso', { getSession: () => ({ tenantId: 'demo' }), getRequestContext: () => ({ userId: '7', empresaId: '1' }), delayMs: 0, seed });
  render(
    <ServicesProvider services={services}>
      <DialogStackProvider>
        <UiCatalog config={toCatalogConfig(REGISTRY.bySlug.get(slug))} permissions={granted} />
      </DialogStackProvider>
    </ServicesProvider>,
  );
  return userEvent.setup();
}
const field = (label: string) => screen.getByLabelText(label) as HTMLInputElement;
const select = (label: string) => screen.getByLabelText(label) as HTMLSelectElement;
const dialog = () => screen.getByRole('dialog');
const options = (label: string) => [...select(label).options].map((o) => o.textContent);
const submit = (user: ReturnType<typeof userEvent.setup>) => user.click(within(dialog()).getByRole('button', { name: 'Aceptar' }));
const choose = async (user: ReturnType<typeof userEvent.setup>, label: string, text: string) => {
  await waitFor(() => expect(options(label)).toContain(text));
  await user.selectOptions(select(label), text);
};

describe('almacen register (S-REF-13)', () => {
  async function openAdd() {
    const user = renderCatalog('almacenes');
    await screen.findByText('ALMACEN CENTRAL');
    await user.click(screen.getByRole('button', { name: 'Agregar' }));
    await screen.findByLabelText('Localidad');
    return user;
  }

  it('lists the almacenes of the session empresa only', async () => {
    renderCatalog('almacenes');
    expect(await screen.findByText('ALMACEN ATE')).toBeTruthy();
    expect(screen.queryByText('ALMACEN CALLAO')).toBeNull();
    expect(screen.queryByText('ALMACEN CERRADO')).toBeNull();
  });

  it('a blank form fails first on the localidad, with the desktop sentence', async () => {
    const user = await openAdd();
    await submit(user);
    expect(screen.getByText('Para agregar un Almacen, debes especificar su Localidad.')).toBeTruthy();
  });

  it('the localidades are those of the session empresa and the punto de venta follows the chosen localidad', async () => {
    const user = await openAdd();
    await waitFor(() => expect(options('Localidad')).toEqual(['--- Seleccione ---', 'LOCAL CENTRAL', 'LOCAL ATE']));
    expect(select('Punto de Venta').disabled).toBe(true);
    await choose(user, 'Localidad', 'LOCAL CENTRAL');
    await waitFor(() => expect(options('Punto de Venta')).toEqual(['--- Seleccione ---', 'TIENDA CENTRAL']));
    await choose(user, 'Localidad', 'LOCAL ATE');
    await waitFor(() => expect(options('Punto de Venta')).toEqual(['--- Seleccione ---', 'TIENDA MIRAFLORES']));
    expect(select('Punto de Venta').value).toBe('');
  });

  it('S-REF-13 departamento and provincia without a distrito say su Distrito; the checkboxes start unchecked', async () => {
    const user = await openAdd();
    for (const label of ['Direccionamiento Facturación', 'Habilitar Despacho', 'Habilitar Venta']) expect((screen.getByLabelText(label) as HTMLInputElement).checked).toBe(false);
    await choose(user, 'Localidad', 'LOCAL CENTRAL');
    await choose(user, 'Punto de Venta', 'TIENDA CENTRAL');
    await user.type(field('Descripción'), 'bodega uno');
    await user.type(field('Dirección'), 'av. uno 100');
    await choose(user, 'Departamento', 'LIMA');
    await choose(user, 'Provincia', 'LIMA');
    await submit(user);
    expect(screen.getByText('Para agregar un Almacen, debes especificar su Distrito.')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Confirmar' })).toBeNull();
  });

  it('saves a complete form and lists it with its names', async () => {
    const user = await openAdd();
    await choose(user, 'Localidad', 'LOCAL ATE');
    await choose(user, 'Punto de Venta', 'TIENDA MIRAFLORES');
    await user.type(field('Descripción'), 'bodega uno');
    await user.type(field('Dirección'), 'av. uno 100');
    await choose(user, 'Departamento', 'LIMA');
    await choose(user, 'Provincia', 'LIMA');
    await choose(user, 'Distrito', 'ATE');
    await user.click(screen.getByLabelText('Habilitar Venta'));
    await submit(user);
    await user.click(await screen.findByRole('button', { name: 'Confirmar' }));
    expect(await screen.findByText('BODEGA UNO')).toBeTruthy();
  });
});

describe('zona register (S-REF-33, S-REF-7)', () => {
  async function openAdd() {
    const user = renderCatalog('zonas');
    await screen.findByText('LIMA CENTRO');
    await user.click(screen.getByRole('button', { name: 'Agregar' }));
    await screen.findByLabelText('Descripción');
    return user;
  }

  it('S-REF-33 a descripcion and no departamento says Seleccionar un Departamento', async () => {
    const user = await openAdd();
    await user.type(field('Descripción'), 'norte');
    await submit(user);
    expect(screen.getByText('Para agregar una Zona, debes Seleccionar un Departamento.')).toBeTruthy();
  });

  it('S-REF-33 the levels are asked in order, with their own article: una Provincia, then un Distrito', async () => {
    const user = await openAdd();
    await user.type(field('Descripción'), 'norte');
    await choose(user, 'Departamento', 'LIMA');
    await submit(user);
    expect(screen.getByText('Para agregar una Zona, debes Seleccionar una Provincia.')).toBeTruthy();
    await choose(user, 'Provincia', 'LIMA');
    await submit(user);
    expect(screen.getByText('Para agregar una Zona, debes Seleccionar un Distrito.')).toBeTruthy();
  });

  it('a blank descripcion says the desktop M1 sentence first', async () => {
    const user = await openAdd();
    await submit(user);
    expect(screen.getByText('Para agregar una Zona, debes especificar su Descripcion.')).toBeTruthy();
  });

  it('S-REF-7 INSERT shows estado checked and read-only; UPDATE lets it change', async () => {
    const user = await openAdd();
    expect([(screen.getByLabelText('Activo') as HTMLInputElement).checked, (screen.getByLabelText('Activo') as HTMLInputElement).disabled]).toEqual([true, true]);
    await user.click(within(dialog()).getByRole('button', { name: 'Cancelar' }));
    await user.click(await screen.findByText('ATE ESTE'));
    await user.click(screen.getByRole('button', { name: 'Modificar' }));
    await screen.findByLabelText('Descripción');
    expect((screen.getByLabelText('Activo') as HTMLInputElement).disabled).toBe(false);
  });
});

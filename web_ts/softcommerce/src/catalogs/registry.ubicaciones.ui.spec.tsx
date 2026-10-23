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

/** The real `ubicaciones` entry rendered over the demo seed, acting for empresa 1. */
function renderCatalog() {
  const services = createAppServicesMock('exitoso', { getSession: () => ({ tenantId: 'demo' }), getRequestContext: () => ({ empresaId: '1' }), delayMs: 0, seed });
  render(
    <ServicesProvider services={services}>
      <DialogStackProvider>
        <UiCatalog config={toCatalogConfig(REGISTRY.bySlug.get('ubicaciones'))} permissions={granted} />
      </DialogStackProvider>
    </ServicesProvider>,
  );
  return userEvent.setup();
}
type User = ReturnType<typeof userEvent.setup>;
const select = (label: string) => screen.getByLabelText(label) as HTMLSelectElement;
const dialog = () => screen.getByRole('dialog');
const options = (label: string) => [...select(label).options].map((o) => o.textContent);
const submit = (user: User) => user.click(within(dialog()).getByRole('button', { name: 'Aceptar' }));
const choose = async (user: User, label: string, text: string) => {
  await waitFor(() => expect(options(label)).toContain(text));
  await user.selectOptions(select(label), text);
};

async function openAdd() {
  const user = renderCatalog();
  await screen.findByText('PASILLO A');
  await user.click(screen.getByRole('button', { name: 'Agregar' }));
  await screen.findByLabelText('Localidad');
  return user;
}

describe('ubicacion register (S-REF-30)', () => {
  it('lists the active ubicaciones with their joined names', async () => {
    renderCatalog();
    expect(await screen.findByText('PASILLO A')).toBeTruthy();
    expect(screen.getByText('ESTANTE 1')).toBeTruthy();
    expect(screen.queryByText('OBSOLETA')).toBeNull();
    expect(screen.getAllByText('ALMACEN CENTRAL').length).toBeGreaterThan(0);
  });

  it('S-REF-30 the literal messages come one by one, in order, as each is fixed', async () => {
    const user = await openAdd();
    await submit(user);
    expect(screen.getByText('Seleccione Localidad')).toBeTruthy();
    await choose(user, 'Localidad', 'LOCAL CENTRAL');
    await submit(user);
    expect(screen.getByText('Seleccione Punto de Venta')).toBeTruthy();
    await choose(user, 'Punto de Venta', 'TIENDA CENTRAL');
    await submit(user);
    expect(screen.getByText('Seleccione Almacen')).toBeTruthy();
    await choose(user, 'Almacen', 'ALMACEN CENTRAL');
    await submit(user);
    expect(screen.getByText('Ingrese Descripcion')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Confirmar' })).toBeNull();
  });

  it('the chain localidad > punto de venta > almacen is disabled until its parent is chosen, and clears downward', async () => {
    const user = await openAdd();
    expect([select('Punto de Venta').disabled, select('Almacen').disabled]).toEqual([true, true]);
    await choose(user, 'Localidad', 'LOCAL CENTRAL');
    expect(select('Punto de Venta').disabled).toBe(false);
    expect(select('Almacen').disabled).toBe(true);
    await choose(user, 'Punto de Venta', 'TIENDA CENTRAL');
    await waitFor(() => expect(options('Almacen')).toEqual(['--- Seleccione ---', 'ALMACEN CENTRAL']));
    await choose(user, 'Almacen', 'ALMACEN CENTRAL');
    await choose(user, 'Localidad', 'LOCAL ATE');
    await waitFor(() => expect(options('Punto de Venta')).toEqual(['--- Seleccione ---', 'TIENDA MIRAFLORES']));
    expect([select('Punto de Venta').value, select('Almacen').value, select('Almacen').disabled]).toEqual(['', '', true]);
  });

  it('saves a complete form and lists it', async () => {
    const user = await openAdd();
    await choose(user, 'Localidad', 'LOCAL ATE');
    await choose(user, 'Punto de Venta', 'TIENDA MIRAFLORES');
    await choose(user, 'Almacen', 'ALMACEN ATE');
    await user.type(screen.getByLabelText('Descripción'), 'pasillo nuevo');
    await submit(user);
    await user.click(await screen.findByRole('button', { name: 'Confirmar' }));
    expect(await screen.findByText('PASILLO NUEVO')).toBeTruthy();
  });

  it('UPDATE restores the whole chain with its options loaded', async () => {
    const user = renderCatalog();
    await user.click(await screen.findByText('ESTANTE 1'));
    await user.click(screen.getByRole('button', { name: 'Modificar' }));
    await screen.findByLabelText('Localidad');
    await waitFor(() => expect([select('Localidad').selectedOptions[0].textContent, select('Punto de Venta').selectedOptions[0]?.textContent, select('Almacen').selectedOptions[0]?.textContent]).toEqual(['LOCAL ATE', 'TIENDA MIRAFLORES', 'ALMACEN ATE']));
  });
});

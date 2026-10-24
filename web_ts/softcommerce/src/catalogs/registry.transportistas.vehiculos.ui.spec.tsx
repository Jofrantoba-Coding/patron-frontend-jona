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

/** The Transportista register over the demo seed: its `Vehiculo` tab is the W2 vehiculos store seen through the propietario (S-MST-10, S-MST-11, S-MD-3, S-MD-6, S-MD-11). */
function render_() {
  const services = createAppServicesMock('exitoso', { getSession: () => ({ tenantId: 'demo' }), getRequestContext: () => ({ userId: '7' }), delayMs: 0, seed });
  render(
    <ServicesProvider services={services}>
      <DialogStackProvider>
        <UiCatalog config={toCatalogConfig(REGISTRY.bySlug.get('transportistas'))} permissions={granted} />
      </DialogStackProvider>
    </ServicesProvider>,
  );
  return { user: userEvent.setup(), services };
}
type User = ReturnType<typeof userEvent.setup>;
const dialog = () => screen.getByRole('dialog');
const panel = () => screen.getByRole('tabpanel', { name: 'Vehiculo', hidden: true });
const field = (label: string) => within(panel()).getByLabelText(label) as HTMLInputElement | HTMLSelectElement;
const gridRows = () => within(panel()).queryAllByRole('row').slice(1).map((tr) => within(tr).getAllByRole('cell').slice(1).map((td) => td.textContent));
const agregar = (user: User) => user.click(within(panel()).getByRole('button', { name: 'Agregar' }));

async function open(user: User, button: 'Agregar' | 'Modificar' | 'Detalle', row?: string) {
  await user.click(await screen.findByText(row ?? 'TRANSPORTES RAPIDO SAC'));
  await user.click(screen.getByRole('button', { name: button }));
  await screen.findByLabelText('Tipo de Documento');
  await user.click(screen.getByRole('tab', { name: 'Vehiculo' }));
}
async function openInsert(user: User) {
  await screen.findByText('TRANSPORTES RAPIDO SAC');
  await user.click(screen.getByRole('button', { name: 'Agregar' }));
  await screen.findByLabelText('Tipo de Documento');
  await user.click(screen.getByRole('tab', { name: 'Vehiculo' }));
  await waitFor(() => expect((field('Marca') as HTMLSelectElement).options.length).toBeGreaterThan(1));
}
async function fillValid(user: User) {
  await user.type(field('Const inscripcion'), 'ci-5');
  await user.type(field('Placa'), 'qwe123');
  await user.clear(field('Peso(KG)'));
  await user.type(field('Peso(KG)'), '900');
  await user.selectOptions(field('Marca'), 'HYUNDAI');
  await user.selectOptions(field('Modelo'), 'HILUX');
}

describe('transportistas Vehiculo tab', () => {
  it('lists the persisted vehiculos of the transportista with the desktop columns, the marca and modelo names joined (S-MST-11)', async () => {
    const { user } = render_();
    await open(user, 'Modificar');
    await waitFor(() => expect(gridRows()).toHaveLength(2));
    expect(within(panel()).getAllByRole('columnheader').slice(1).map((th) => th.textContent)).toEqual(['CODIGO', 'PLACA', 'CONSTANCIA INSCRIPCION', 'MARCA', 'MODELO']);
    expect(gridRows()[0]).toEqual(['001', 'ABC123', 'CI-0001', 'TOYOTA', 'HILUX']);
  });

  it('the entry is the five desktop fields above the grid, peso 0, with no Propietario or Activo and the buttons Agregar and Quitar', async () => {
    const { user } = render_();
    await openInsert(user);
    expect((field('Peso(KG)') as HTMLInputElement).value).toBe('0');
    for (const present of ['Const inscripcion', 'Placa', 'Marca', 'Modelo']) expect(field(present), present).toBeTruthy();
    for (const absent of ['Propietario', 'Activo']) expect(within(panel()).queryByLabelText(absent), absent).toBeNull();
    expect(within(panel()).getAllByRole('button').map((b) => b.textContent)).toEqual(['Agregar', 'Quitar']);
  });

  it('S-MST-10 a blank entry says Ingrese Constancia, Ingrese Placa, Ingrese Peso, Seleccione Marca and Seleccione Modelo in turn, and adds nothing', async () => {
    const { user } = render_();
    await openInsert(user);
    await agregar(user);
    expect(within(panel()).getByText('Ingrese Constancia')).toBeTruthy();
    await user.type(field('Const inscripcion'), 'ci-5');
    await agregar(user);
    expect(within(panel()).getByText('Ingrese Placa')).toBeTruthy();
    await user.type(field('Placa'), 'qwe123');
    await user.clear(field('Peso(KG)'));
    await agregar(user);
    expect(within(panel()).getByText('Ingrese Peso')).toBeTruthy();
    await user.type(field('Peso(KG)'), '900');
    await agregar(user);
    expect(within(panel()).getByText('Seleccione Marca')).toBeTruthy();
    await user.selectOptions(field('Marca'), 'HYUNDAI');
    await agregar(user);
    expect(within(panel()).getByText('Seleccione Modelo')).toBeTruthy();
    expect(gridRows()).toEqual([]);
  });

  it('S-MST-10 a valid add shows one pending row with the marca and modelo names and resets the entry (peso 0)', async () => {
    const { user } = render_();
    await openInsert(user);
    await fillValid(user);
    await agregar(user);
    await waitFor(() => expect(gridRows()).toEqual([['', 'QWE123', 'CI-5', 'HYUNDAI', 'HILUX']]));
    expect([field('Const inscripcion').value, field('Placa').value, field('Peso(KG)').value]).toEqual(['', '', '0']);
  });

  it('Quitar with no selection says Seleccione Vehiculo; a selected row asks Desea Quitar el Vehiculo? and leaves the grid', async () => {
    const { user } = render_();
    await open(user, 'Modificar');
    await waitFor(() => expect(gridRows()).toHaveLength(2));
    await user.click(within(panel()).getByRole('button', { name: 'Quitar' }));
    expect(within(panel()).getByRole('status').textContent).toBe('Seleccione Vehiculo');
    await user.click(within(panel()).getByText('ABC123'));
    await user.click(within(panel()).getByRole('button', { name: 'Quitar' }));
    expect(await screen.findByText('Desea Quitar el Vehiculo?')).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'Confirmar' }));
    await waitFor(() => expect(gridRows().map((r) => r[1])).toEqual(['XYZ789']));
  });

  it('S-MD-6 saving deletes the removed vehiculo: it leaves the W2 vehiculos list', async () => {
    const { user, services } = render_();
    await open(user, 'Modificar');
    await waitFor(() => expect(gridRows()).toHaveLength(2));
    await user.click(within(panel()).getByText('ABC123'));
    await user.click(within(panel()).getByRole('button', { name: 'Quitar' }));
    await user.click(await screen.findByRole('button', { name: 'Confirmar' }));
    await user.click(within(dialog()).getByRole('button', { name: 'Aceptar' }));
    await user.click(await screen.findByRole('button', { name: 'Confirmar' }));
    await waitFor(async () => expect(((await services.catalog('vehiculos').list({})) as any).items.map((r: any) => r.placa)).not.toContain('ABC123'));
  });

  it('S-MST-11 saving a pending add creates the vehiculo with this transportista as propietario', async () => {
    const { user, services } = render_();
    await open(user, 'Modificar');
    await waitFor(() => expect(gridRows()).toHaveLength(2));
    await fillValid(user);
    await agregar(user);
    await waitFor(() => expect(gridRows()).toHaveLength(3));
    await user.click(within(dialog()).getByRole('button', { name: 'Aceptar' }));
    await user.click(await screen.findByRole('button', { name: 'Confirmar' }));
    await waitFor(async () => expect(((await services.catalog('vehiculos').list({})) as any).items.find((r: any) => r.placa === 'QWE123')).toMatchObject({ id_anexo_empresa_transportista: '0000000001', transportista: 'TRANSPORTES RAPIDO SAC' }));
  });

  it('S-MD-11 DETAIL shows the grid with no entry and a disabled Quitar', async () => {
    const { user } = render_();
    await open(user, 'Detalle');
    await waitFor(() => expect(gridRows()).toHaveLength(2));
    expect(within(panel()).queryByLabelText('Placa')).toBeNull();
    expect((within(panel()).getByRole('button', { name: 'Quitar' }) as HTMLButtonElement).disabled).toBe(true);
  });
});

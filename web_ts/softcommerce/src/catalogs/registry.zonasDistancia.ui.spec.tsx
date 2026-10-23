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

/** The real `zonas-distancia` entry rendered over the demo seed (acting for user 7, empresa 1), against the in-browser mock. */
function renderCatalog() {
  const services = createAppServicesMock('exitoso', { getSession: () => ({ tenantId: 'demo' }), getRequestContext: () => ({ userId: '7', empresaId: '1' }), delayMs: 0, seed });
  render(
    <ServicesProvider services={services}>
      <DialogStackProvider>
        <UiCatalog config={toCatalogConfig(REGISTRY.bySlug.get('zonas-distancia'))} permissions={granted} />
      </DialogStackProvider>
    </ServicesProvider>,
  );
  return userEvent.setup();
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
const sentence = (what: string) => `Para agregar una Zona Distancia, debes ${what}.`;

async function openAdd() {
  const user = renderCatalog();
  await screen.findByText('ATE ESTE');
  await user.click(screen.getByRole('button', { name: 'Agregar' }));
  await screen.findByLabelText('Departamento');
  return user;
}
/** Chain A down to the zona of Lima centro, chain B down to the almacen of the central local. */
async function fillChains(user: User) {
  await choose(user, 'Departamento', 'LIMA');
  await choose(user, 'Provincia', 'LIMA');
  await choose(user, 'Distrito', 'LIMA');
  await choose(user, 'Zona', 'LIMA CENTRO');
  await choose(user, 'Localidad', 'LOCAL CENTRAL');
  await choose(user, 'Pto Vta', 'TIENDA CENTRAL');
  await choose(user, 'Almacen', 'ALMACEN CENTRAL');
}

describe('zona-distancia register (S-REF-22, S-MOCK-31, 11.0)', () => {
  it('lists the active zonas distancia with their joined names and the distance as stored', async () => {
    renderCatalog();
    expect(await screen.findByText('ATE ESTE')).toBeTruthy();
    expect(screen.getAllByText('LIMA CENTRO').length).toBeGreaterThan(0);
    expect(screen.getByText('12.5')).toBeTruthy();
    expect(screen.queryByText('99')).toBeNull();
  });

  it('the cascade offers only the ubigeos that hold an active zona, level by level', async () => {
    const user = await openAdd();
    await waitFor(() => expect(options('Departamento')).toEqual(['Seleccione', 'CALLAO', 'LIMA']));
    await choose(user, 'Departamento', 'LIMA');
    await waitFor(() => expect(options('Provincia')).toEqual(['Seleccione', 'LIMA']));
    await choose(user, 'Provincia', 'LIMA');
    await waitFor(() => expect(options('Distrito')).toEqual(['Seleccione', 'LIMA', 'ATE']));
  });

  it('S-REF-22 the departamento clears provincia, distrito and zona; the zona waits for the distrito and loads its zonas', async () => {
    const user = await openAdd();
    expect(select('Zona').disabled).toBe(true);
    await choose(user, 'Departamento', 'LIMA');
    await choose(user, 'Provincia', 'LIMA');
    await choose(user, 'Distrito', 'ATE');
    await waitFor(() => expect(options('Zona')).toEqual(['--- Seleccione ---', 'ATE ESTE']));
    await choose(user, 'Zona', 'ATE ESTE');
    await choose(user, 'Departamento', 'CALLAO');
    expect([select('Provincia').value, select('Distrito').value, select('Zona').value]).toEqual(['', '', '']);
    expect([select('Distrito').disabled, select('Zona').disabled]).toEqual([true, true]);
  });

  it('S-REF-22 the localidad clears the punto de venta and the almacen, which block again', async () => {
    const user = await openAdd();
    await choose(user, 'Localidad', 'LOCAL CENTRAL');
    await choose(user, 'Pto Vta', 'TIENDA CENTRAL');
    await choose(user, 'Almacen', 'ALMACEN CENTRAL');
    await choose(user, 'Localidad', 'LOCAL ATE');
    expect([select('Pto Vta').value, select('Almacen').value, select('Almacen').disabled]).toEqual(['', '', true]);
    await waitFor(() => expect(options('Pto Vta')).toEqual(['--- Seleccione ---', 'TIENDA MIRAFLORES']));
  });

  it('the MS sentences come one by one in the desktop order, each fixed as the user goes', async () => {
    const user = await openAdd();
    await submit(user);
    expect(screen.getByText(sentence('Seleccionar un Departamento'))).toBeTruthy();
    await choose(user, 'Departamento', 'LIMA');
    await submit(user);
    expect(screen.getByText(sentence('Seleccionar una Provincia'))).toBeTruthy();
    await choose(user, 'Provincia', 'LIMA');
    await submit(user);
    expect(screen.getByText(sentence('Seleccionar un Distrito'))).toBeTruthy();
    await choose(user, 'Distrito', 'LIMA');
    await submit(user);
    expect(screen.getByText(sentence('Seleccionar una Zona'))).toBeTruthy();
    await choose(user, 'Zona', 'LIMA CENTRO');
    await submit(user);
    expect(screen.getByText(sentence('Seleccionar una Localidad'))).toBeTruthy();
    await choose(user, 'Localidad', 'LOCAL CENTRAL');
    await submit(user);
    expect(screen.getByText(sentence('Seleccionar un Pto Vta'))).toBeTruthy();
    await choose(user, 'Pto Vta', 'TIENDA CENTRAL');
    await submit(user);
    expect(screen.getByText(sentence('Seleccionar un Almacen'))).toBeTruthy();
    await choose(user, 'Almacen', 'ALMACEN CENTRAL');
    await submit(user);
    expect(screen.getByText(sentence('especificar su Distancia'))).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Confirmar' })).toBeNull();
  });

  it.each(['0', '-5', '0.0'])('S-REF-22 distancia %s is rejected with the Distancia sentence [DEVIATION: > 0]', async (typed) => {
    const user = await openAdd();
    await fillChains(user);
    await user.type(screen.getByLabelText('Distancia(Km)'), typed);
    await submit(user);
    expect(screen.getByText(sentence('especificar su Distancia'))).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Confirmar' })).toBeNull();
  });

  it('saves a complete form, sending only the stored fields, and lists it', async () => {
    const user = await openAdd();
    await fillChains(user);
    await user.type(screen.getByLabelText('Distancia(Km)'), '7.5');
    await submit(user);
    await user.click(await screen.findByRole('button', { name: 'Confirmar' }));
    await waitFor(() => expect(screen.getAllByText('LIMA CENTRO').length).toBeGreaterThan(1));
    expect(screen.getByText('7.5')).toBeTruthy();
  });

  it('S-REF-22 UPDATE restores the cascade from the stored zona and chain B, every level with its options', async () => {
    const user = renderCatalog();
    await user.click(await screen.findByText('ATE ESTE'));
    await user.click(screen.getByRole('button', { name: 'Modificar' }));
    await screen.findByLabelText('Departamento');
    await waitFor(() => expect([shown('Departamento'), shown('Provincia'), shown('Distrito'), shown('Zona')]).toEqual(['LIMA', 'LIMA', 'ATE', 'ATE ESTE']));
    await waitFor(() => expect([shown('Localidad'), shown('Pto Vta'), shown('Almacen')]).toEqual(['LOCAL ATE', 'TIENDA MIRAFLORES', 'ALMACEN ATE']));
    expect((screen.getByLabelText('Distancia(Km)') as HTMLInputElement).value).toBe('30');
    expect(options('Zona')).toEqual(['--- Seleccione ---', 'ATE ESTE']);
  });

  it('UPDATE changes the distancia only and the cascade does not travel: the zona stays and the list shows the new value', async () => {
    const user = renderCatalog();
    await user.click(await screen.findByText('ATE ESTE'));
    await user.click(screen.getByRole('button', { name: 'Modificar' }));
    await waitFor(() => expect(shown('Zona')).toBe('ATE ESTE'));
    await user.clear(screen.getByLabelText('Distancia(Km)'));
    await user.type(screen.getByLabelText('Distancia(Km)'), '31');
    await submit(user);
    await user.click(await screen.findByRole('button', { name: 'Confirmar' }));
    expect(await screen.findByText('31')).toBeTruthy();
    expect(screen.getAllByText('ATE ESTE').length).toBeGreaterThan(0);
  });

  it.each(['Clonar', 'Detalle'])('%s restores the cascade as well', async (action) => {
    const user = renderCatalog();
    await user.click(await screen.findByText('ATE ESTE'));
    await user.click(screen.getByRole('button', { name: action }));
    await screen.findByLabelText('Departamento');
    await waitFor(() => expect([shown('Departamento'), shown('Provincia'), shown('Distrito'), shown('Zona')]).toEqual(['LIMA', 'LIMA', 'ATE', 'ATE ESTE']));
  });
});

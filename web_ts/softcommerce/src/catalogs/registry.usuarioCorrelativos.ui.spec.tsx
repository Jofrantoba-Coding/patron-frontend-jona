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

/** The real `usuario-correlativos` entry rendered over the demo seed (acting for user 7, empresa 1), against the in-browser mock. */
function renderCatalog() {
  const services = createAppServicesMock('exitoso', { getSession: () => ({ tenantId: 'demo' }), getRequestContext: () => ({ userId: '7', empresaId: '1' }), delayMs: 0, seed });
  render(
    <ServicesProvider services={services}>
      <DialogStackProvider>
        <UiCatalog config={toCatalogConfig(REGISTRY.bySlug.get('usuario-correlativos'))} permissions={granted} />
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

async function openAdd() {
  const user = renderCatalog();
  await screen.findByText('F001');
  await user.click(screen.getByRole('button', { name: 'Agregar' }));
  await screen.findByLabelText('Usuario');
  return user;
}

describe('usuario-correlativo register (S-REF-17, S-CRUD-40)', () => {
  it('lists the active assignments of the session empresa with their joined names, shown by serie', async () => {
    renderCatalog();
    expect((await screen.findAllByText('Cajero Uno')).length).toBe(2);
    expect(screen.getAllByText('F001').length).toBe(1);
    expect(screen.getByText('T001')).toBeTruthy();
    // The assignment of empresa 2 and the deleted one are not listed.
    expect(screen.queryByText('ALMACEN CALLAO')).toBeNull();
    expect(screen.queryByText('Sin Acceso Escritorio')).toBeNull();
  });

  it('INSERT offers every tenant user, starts Habilitar checked and keeps the whole chain below the localidad blocked', async () => {
    await openAdd();
    await waitFor(() => expect(options('Usuario')).toEqual(['--- Seleccione ---', 'Administrador', 'Cajero Uno', 'Usuario Deshabilitado', 'Sin Acceso Escritorio']));
    expect((screen.getByRole('checkbox', { name: 'Habilitar' }) as HTMLInputElement).checked).toBe(true);
    expect([select('P Venta').disabled, select('T Documento').disabled, select('Serie').disabled]).toEqual([true, true, true]);
  });

  it('the label messages come one by one in the desktop order, each with its own article', async () => {
    const user = await openAdd();
    const sentence = (what: string) => `Para agregar una Asignasion de Usuario - Correlativo, debes especificar ${what}.`;
    await submit(user);
    expect(screen.getByText(sentence('el Usuario'))).toBeTruthy();
    await choose(user, 'Usuario', 'Administrador');
    await submit(user);
    expect(screen.getByText(sentence('la Localidad'))).toBeTruthy();
    await choose(user, 'Localidad', 'LOCAL CENTRAL');
    await submit(user);
    expect(screen.getByText(sentence('el Punto de Venta'))).toBeTruthy();
    await choose(user, 'P Venta', 'TIENDA CENTRAL');
    await submit(user);
    expect(screen.getByText(sentence('el Tipo de documento'))).toBeTruthy();
    await choose(user, 'T Documento', 'FACTURA');
    await submit(user);
    expect(screen.getByText(sentence('su serie'))).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Confirmar' })).toBeNull();
  });

  it('S-CRUD-40 the tipo follows the punto de venta; the serie waits for the tipo too and shows the serie', async () => {
    const user = await openAdd();
    await choose(user, 'Localidad', 'LOCAL CENTRAL');
    await choose(user, 'P Venta', 'TIENDA CENTRAL');
    await waitFor(() => expect(options('T Documento')).toEqual(['--- Seleccione ---', 'FACTURA', 'TICKET']));
    expect(select('Serie').disabled).toBe(true);
    await choose(user, 'T Documento', 'FACTURA');
    await waitFor(() => expect(options('Serie')).toEqual(['--- Seleccione ---', 'F001']));
    expect(select('Serie').disabled).toBe(false);
    await choose(user, 'T Documento', 'TICKET');
    expect(select('Serie').value).toBe('');
    await waitFor(() => expect(options('Serie')).toEqual(['--- Seleccione ---', 'T001']));
  });

  it('S-REF-17 changing the localidad clears the punto de venta, the tipo and the serie downward', async () => {
    const user = await openAdd();
    await choose(user, 'Localidad', 'LOCAL CENTRAL');
    await choose(user, 'P Venta', 'TIENDA CENTRAL');
    await choose(user, 'T Documento', 'FACTURA');
    await choose(user, 'Serie', 'F001');
    await choose(user, 'Localidad', 'LOCAL ATE');
    expect([select('P Venta').value, select('T Documento').value, select('Serie').value]).toEqual(['', '', '']);
    expect([select('T Documento').disabled, select('Serie').disabled]).toEqual([true, true]);
    await waitFor(() => expect(options('P Venta')).toEqual(['--- Seleccione ---', 'TIENDA MIRAFLORES']));
  });

  it('S-REF-17 the same usuario and serie shows the desktop sentence under Serie and keeps the values', async () => {
    const user = await openAdd();
    await choose(user, 'Usuario', 'Cajero Uno');
    await choose(user, 'Localidad', 'LOCAL CENTRAL');
    await choose(user, 'P Venta', 'TIENDA CENTRAL');
    await choose(user, 'T Documento', 'FACTURA');
    await choose(user, 'Serie', 'F001');
    await submit(user);
    await user.click(await screen.findByRole('button', { name: 'Confirmar' }));
    expect(await screen.findByText('Ya existe una asignacion del documento con la serie elegida al mismo usuario, por favor elija otra serie u otro usuario disponible.')).toBeTruthy();
    expect(shown('Usuario')).toBe('Cajero Uno');
    expect(shown('Serie')).toBe('F001');
  });

  it('S-REF-17 another usuario with that serie saves and is listed', async () => {
    const user = await openAdd();
    await choose(user, 'Usuario', 'Administrador');
    await choose(user, 'Localidad', 'LOCAL CENTRAL');
    await choose(user, 'P Venta', 'TIENDA CENTRAL');
    await choose(user, 'T Documento', 'FACTURA');
    await choose(user, 'Serie', 'F001');
    await submit(user);
    await user.click(await screen.findByRole('button', { name: 'Confirmar' }));
    await waitFor(() => expect(screen.getAllByText('F001').length).toBe(2));
  });

  it('UPDATE restores usuario, localidad, punto de venta, tipo and serie, each with its options loaded', async () => {
    const user = renderCatalog();
    await user.click((await screen.findAllByText('Cajero Uno'))[0]);
    await user.click(screen.getByRole('button', { name: 'Modificar' }));
    await screen.findByLabelText('Usuario');
    await waitFor(() => expect([shown('Usuario'), shown('Localidad'), shown('P Venta'), shown('T Documento'), shown('Serie')]).toEqual(['Cajero Uno', 'LOCAL CENTRAL', 'TIENDA CENTRAL', 'FACTURA', 'F001']));
    expect(options('T Documento')).toEqual(['--- Seleccione ---', 'FACTURA', 'TICKET']);
  });

  it('S-REF-17 CLONE keeping the pair is rejected [DEVIATION]', async () => {
    const user = renderCatalog();
    await user.click((await screen.findAllByText('Cajero Uno'))[0]);
    await user.click(screen.getByRole('button', { name: 'Clonar' }));
    await screen.findByLabelText('Usuario');
    await waitFor(() => expect(shown('Serie')).toBe('F001'));
    await submit(user);
    await user.click(await screen.findByRole('button', { name: 'Confirmar' }));
    expect(await screen.findByText('Ya existe una asignacion del documento con la serie elegida al mismo usuario, por favor elija otra serie u otro usuario disponible.')).toBeTruthy();
  });
});

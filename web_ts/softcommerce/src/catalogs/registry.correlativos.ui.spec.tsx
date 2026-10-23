import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
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

/** The real `correlativos` entry rendered over the demo seed (acting for user 7, empresa 1), against the in-browser mock. */
function renderCatalog(slug = 'correlativos') {
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
type User = ReturnType<typeof userEvent.setup>;
// The dialog title also carries the word Correlativo, so the label is matched on the input itself.
const field = (label: string) => screen.getAllByLabelText(label).find((e) => e.tagName === 'INPUT') as HTMLInputElement;
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
  await screen.findByText('0000000125');
  await user.click(screen.getByRole('button', { name: 'Agregar' }));
  await screen.findByLabelText('Tipo de Documento');
  return user;
}
/** A complete form for punto de venta 2 (LOCAL ATE), ready for the tipo to be chosen. */
async function fillPuntoVenta2(user: User, serie: string) {
  await user.type(field('Serie'), serie);
  await user.type(field('Correlativo'), '1');
  await choose(user, 'Localidad', 'LOCAL ATE');
  await choose(user, 'Punto de Venta', 'TIENDA MIRAFLORES');
}

describe('correlativo register (S-REF-14, S-REF-15, S-REF-16)', () => {
  it('lists the active correlativos with their joined names', async () => {
    renderCatalog();
    expect(await screen.findByText('0000000125')).toBeTruthy();
    expect(screen.getAllByText('FACTURA').length).toBeGreaterThan(0);
    expect(screen.getAllByText('TIENDA CENTRAL').length).toBeGreaterThan(0);
  });

  it('INSERT offers the tipos de documento (TI, 01 and 03 among them), starts Activo and Se imprime Sí', async () => {
    await openAdd();
    await waitFor(() => expect(options('Tipo de Documento')).toEqual(expect.arrayContaining(['FACTURA', 'BOLETA DE VENTA', 'TICKET'])));
    expect((screen.getByRole('radio', { name: 'Activo' }) as HTMLInputElement).checked).toBe(true);
    expect((screen.getByRole('radio', { name: 'Sí' }) as HTMLInputElement).checked).toBe(true);
  });

  it('S-REF-15 the ticket fields appear only for the tipo TI and hide again for another', async () => {
    const user = await openAdd();
    expect(screen.queryByLabelText('Nro Autorizacion')).toBeNull();
    await choose(user, 'Tipo de Documento', 'TICKET');
    expect(field('Nro Autorizacion')).toBeTruthy();
    expect(field('Codigo Maquina')).toBeTruthy();
    await choose(user, 'Tipo de Documento', 'FACTURA');
    expect(screen.queryByLabelText('Nro Autorizacion')).toBeNull();
    expect(screen.queryByLabelText('Codigo Maquina')).toBeNull();
  });

  it('S-REF-16 serie pads to four and correlativo to ten when the focus leaves; a fifth character is ignored', async () => {
    const user = await openAdd();
    await user.type(field('Serie'), 'f1');
    await user.tab();
    expect(field('Serie').value).toBe('00F1');
    await user.clear(field('Serie'));
    fireEvent.change(field('Serie'), { target: { value: 'abcde' } });
    expect(field('Serie').value).toBe('');
    await user.type(field('Serie'), 'abcd');
    expect(field('Serie').value).toBe('ABCD');
    await user.type(field('Correlativo'), '25');
    await user.tab();
    expect(field('Correlativo').value).toBe('0000000025');
  });

  it('a blank form fails first on the tipo de documento with the desktop sentence', async () => {
    const user = await openAdd();
    await submit(user);
    expect(screen.getByText('Para agregar un Correlativo, debes especificar su Tipo de Documento.')).toBeTruthy();
  });

  it('S-REF-15 a ticket with only the authorization number passes the client and the server names the machine code', async () => {
    const user = await openAdd();
    await choose(user, 'Tipo de Documento', 'TICKET');
    await fillPuntoVenta2(user, 'T009');
    await user.type(field('Nro Autorizacion'), 'a1');
    await submit(user);
    await user.click(await screen.findByRole('button', { name: 'Confirmar' }));
    expect(await screen.findByText('Para agregar un Correlativo, debes especificar su Codigo de Maquina.')).toBeTruthy();
    await waitFor(() => expect(document.activeElement).toBe(field('Codigo Maquina')));
    expect(field('Nro Autorizacion').value).toBe('A1');
  });

  it('S-REF-15 a ticket with both fields saves and lists', async () => {
    const user = await openAdd();
    await choose(user, 'Tipo de Documento', 'TICKET');
    await fillPuntoVenta2(user, 'T009');
    await user.type(field('Nro Autorizacion'), 'a1');
    await user.type(field('Codigo Maquina'), 'mq1');
    await submit(user);
    await user.click(await screen.findByRole('button', { name: 'Confirmar' }));
    expect(await screen.findByText('T009')).toBeTruthy();
  });

  it('S-REF-14 a duplicate serie shows the desktop sentence under Serie and keeps the values', async () => {
    const user = await openAdd();
    await choose(user, 'Tipo de Documento', 'FACTURA');
    await user.type(field('Serie'), 'F001');
    await user.type(field('Correlativo'), '7');
    await choose(user, 'Localidad', 'LOCAL CENTRAL');
    await choose(user, 'Punto de Venta', 'TIENDA CENTRAL');
    await submit(user);
    await user.click(await screen.findByRole('button', { name: 'Confirmar' }));
    expect(await screen.findByText('Ya existe una asignacion de la serie al mismo tipo de documento, por favor digite otra serie.')).toBeTruthy();
    await waitFor(() => expect(document.activeElement).toBe(field('Serie')));
    expect(field('Correlativo').value).toBe('0000000007');
  });

  it('S-REF-14 CLONE keeping the triple is rejected [DEVIATION]', async () => {
    const user = renderCatalog();
    await user.click(await screen.findByText('0000000125'));
    await user.click(screen.getByRole('button', { name: 'Clonar' }));
    await screen.findByLabelText('Tipo de Documento');
    await waitFor(() => expect(select('Punto de Venta').value).toBe('1'));
    await submit(user);
    await user.click(await screen.findByRole('button', { name: 'Confirmar' }));
    expect(await screen.findByText('Ya existe una asignacion de la serie al mismo tipo de documento, por favor digite otra serie.')).toBeTruthy();
  });

  it('UPDATE restores the ticket fields of a ticket correlativo', async () => {
    const user = renderCatalog();
    await user.click(await screen.findByText('0000000010'));
    await user.click(screen.getByRole('button', { name: 'Modificar' }));
    await screen.findByLabelText('Tipo de Documento');
    await waitFor(() => expect(field('Nro Autorizacion').value).toBe('0123456789'));
    expect(field('Codigo Maquina').value).toBe('MAQ001');
  });
});

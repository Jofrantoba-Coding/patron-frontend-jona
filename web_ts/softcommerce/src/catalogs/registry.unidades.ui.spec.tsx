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

/** The real `unidades-medida` entry rendered over the demo seed, acting for empresa 1. */
function renderCatalog() {
  const services = createAppServicesMock('exitoso', { getSession: () => ({ tenantId: 'demo' }), getRequestContext: () => ({ userId: '7', empresaId: '1' }), delayMs: 0, seed });
  render(
    <ServicesProvider services={services}>
      <DialogStackProvider>
        <UiCatalog config={toCatalogConfig(REGISTRY.bySlug.get('unidades-medida'))} permissions={granted} />
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
const UNIDADES = ['--- Seleccione ---', 'UNIDAD (BIENES)', 'KILOGRAMO', 'LITRO', 'METRO', 'UNIDAD (SERVICIOS)', 'CAJA'];

async function openAdd() {
  const user = renderCatalog();
  await screen.findByText('KILOGRAMO');
  await user.click(screen.getByRole('button', { name: 'Agregar' }));
  await screen.findByLabelText('Tabla Sunat');
  return user;
}

describe('unidad de medida register (S-REF-24, S-REF-39)', () => {
  it('lists the active unidades of the session empresa only', async () => {
    renderCatalog();
    expect(await screen.findByText('KILOGRAMO')).toBeTruthy();
    expect(screen.getByText('CAJA')).toBeTruthy();
    expect(screen.queryByText('LITRO')).toBeNull();
    expect(screen.queryByText('BOLSA RETIRADA')).toBeNull();
  });

  it('S-REF-24 a fresh INSERT starts on the 6th seeded tabla with its detail options loaded and none chosen', async () => {
    await openAdd();
    expect(shown('Tabla Sunat')).toBe('TABLA 6 - UNIDAD DE MEDIDA');
    await waitFor(() => expect(options('Codigo Sunat')).toEqual(UNIDADES));
    expect([select('Codigo Sunat').value, select('Codigo Sunat').disabled]).toEqual(['', false]);
  });

  it('S-REF-24 changing the tabla clears the detalle and loads that tabla', async () => {
    const user = await openAdd();
    await waitFor(() => expect(options('Codigo Sunat')).toEqual(UNIDADES));
    await user.selectOptions(select('Codigo Sunat'), 'LITRO');
    await user.selectOptions(select('Tabla Sunat'), 'TABLA 5 - TIPO DE EXISTENCIA');
    await waitFor(() => expect(options('Codigo Sunat')).toEqual(['--- Seleccione ---', 'MERCADERIA', 'PRODUCTO TERMINADO', 'MATERIAS PRIMAS Y AUXILIARES']));
    expect(select('Codigo Sunat').value).toBe('');
  });

  it('S-REF-24 with tabla and detalle cleared the record saves with no SUNAT code', async () => {
    const user = await openAdd();
    await user.type(screen.getByLabelText('Descripción'), 'bolsa');
    await user.type(screen.getByLabelText('Abreviatura'), 'bl');
    await user.selectOptions(select('Tabla Sunat'), '--- Seleccione ---');
    await waitFor(() => expect(select('Codigo Sunat').disabled).toBe(true));
    await submit(user);
    await user.click(await screen.findByRole('button', { name: 'Confirmar' }));
    expect(await screen.findByText('BOLSA')).toBeTruthy();
  });

  it('a blank descripcion, then a blank abreviatura, show the desktop messages in that order', async () => {
    const user = await openAdd();
    await submit(user);
    expect(screen.getByText('Para agregar una Unidad de Medida, debes especificar su Descripcion.')).toBeTruthy();
    await user.type(screen.getByLabelText('Descripción'), 'bolsa');
    await submit(user);
    expect(screen.getByText('Para agregar una Unidad de Medida, debes especificar su Abreviatura.')).toBeTruthy();
  });

  it('S-REF-39 the form has no presentation panel: no Presentación, Unidad Base, FP or UP', async () => {
    await openAdd();
    for (const absent of ['Presentación', 'Unidad Base', 'FP', 'UP']) expect(screen.queryByLabelText(absent), absent).toBeNull();
    expect(screen.queryByText('Presentación')).toBeNull();
    expect(screen.queryByText('Unidad Base')).toBeNull();
  });

  it('UPDATE restores the saved tabla and detalle', async () => {
    const user = renderCatalog();
    await user.click(await screen.findByText('KILOGRAMO'));
    await user.click(screen.getByRole('button', { name: 'Modificar' }));
    await screen.findByLabelText('Tabla Sunat');
    await waitFor(() => expect([shown('Tabla Sunat'), shown('Codigo Sunat')]).toEqual(['TABLA 6 - UNIDAD DE MEDIDA', 'KILOGRAMO']));
  });

  it('UPDATE of a unidad saved with no SUNAT code does not select the default tabla again', async () => {
    const user = renderCatalog();
    await user.click(await screen.findByText('CAJA'));
    await user.click(screen.getByRole('button', { name: 'Modificar' }));
    await screen.findByLabelText('Tabla Sunat');
    await waitFor(() => expect([shown('Tabla Sunat'), select('Codigo Sunat').disabled]).toEqual(['--- Seleccione ---', true]));
  });
});

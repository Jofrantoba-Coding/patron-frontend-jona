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

/** The real `tipos-mov-inventario` entry rendered over the demo seed; `extra` clasificaciones of tipo E make "first" distinguishable from "only". */
async function setup() {
  const services = createAppServicesMock('exitoso', { getSession: () => ({ tenantId: 'demo' }), getRequestContext: () => ({ userId: '7', empresaId: '1' }), delayMs: 0, seed });
  const extra: any = await services.catalog('clasif-inventarios').create({ descripcion: 'AJUSTE POSITIVO', abrev: 'AJP', tipo: 'E' });
  return { services, extra };
}
function show(services: ReturnType<typeof createAppServicesMock>) {
  render(
    <ServicesProvider services={services}>
      <DialogStackProvider>
        <UiCatalog config={toCatalogConfig(REGISTRY.bySlug.get('tipos-mov-inventario'))} permissions={granted} />
      </DialogStackProvider>
    </ServicesProvider>,
  );
  return userEvent.setup();
}
async function renderCatalog() {
  show((await setup()).services);
  return userEvent.setup();
}
type User = ReturnType<typeof userEvent.setup>;
const select = (label: string) => screen.getByLabelText(label) as HTMLSelectElement;
const dialog = () => screen.getByRole('dialog');
const options = (label: string) => [...select(label).options].map((o) => o.textContent);
const shown = (label: string) => select(label).selectedOptions[0]?.textContent;
const submit = (user: User) => user.click(within(dialog()).getByRole('button', { name: 'Aceptar' }));

async function openAdd() {
  const user = await renderCatalog();
  await screen.findByText('INGRESO MERCADERIA');
  await user.click(screen.getByRole('button', { name: 'Agregar' }));
  await screen.findByLabelText('Clasificacion');
  return user;
}

describe('tipo de movimiento de inventario register (S-REF-23)', () => {
  it('lists the active tipos with their joined clasificacion and hides the retired one', async () => {
    await renderCatalog();
    expect(await screen.findByText('INGRESO MERCADERIA')).toBeTruthy();
    expect(screen.getByText('SALIDA PRODUCTOS VENTA')).toBeTruthy();
    expect(screen.queryByText('INGRESO RETIRADO')).toBeNull();
  });

  it('a fresh INSERT starts on tipo E and selects the first clasificacion of that tipo', async () => {
    await openAdd();
    expect(select('Tipo').value).toBe('E');
    await waitFor(() => expect(options('Clasificacion')).toEqual(['--- Seleccione ---', 'COMPRA', 'AJUSTE POSITIVO']));
    expect(shown('Clasificacion')).toBe('COMPRA');
  });

  it('changing the tipo to S reloads the clasificaciones and selects the first of that list', async () => {
    const user = await openAdd();
    await waitFor(() => expect(shown('Clasificacion')).toBe('COMPRA'));
    await user.selectOptions(select('Tipo'), 'S');
    await waitFor(() => expect(options('Clasificacion')).toEqual(['--- Seleccione ---', 'VENTA']));
    expect(shown('Clasificacion')).toBe('VENTA');
    await user.selectOptions(select('Tipo'), 'E');
    await waitFor(() => expect(shown('Clasificacion')).toBe('COMPRA'));
  });

  it('the detalle sunat stays disabled until a tabla is chosen, loads that tabla, and clears and disables when the tabla is cleared', async () => {
    const user = await openAdd();
    expect([shown('Tabla Sunat'), select('Codigo Sunat').disabled]).toEqual(['--- Seleccione ---', true]);
    await waitFor(() => expect(options('Tabla Sunat')).toContain('TABLA 12 - TIPO DE OPERACION'));
    await user.selectOptions(select('Tabla Sunat'), 'TABLA 12 - TIPO DE OPERACION');
    await waitFor(() => expect(options('Codigo Sunat')).toEqual(['--- Seleccione ---', 'VENTA', 'COMPRA', 'DEVOLUCION RECIBIDA', 'DEVOLUCION ENTREGADA', 'OTROS']));
    expect(select('Codigo Sunat').disabled).toBe(false);
    await user.selectOptions(select('Codigo Sunat'), 'COMPRA');
    await user.selectOptions(select('Tabla Sunat'), '--- Seleccione ---');
    await waitFor(() => expect([select('Codigo Sunat').value, select('Codigo Sunat').disabled, options('Codigo Sunat')]).toEqual(['', true, ['--- Seleccione ---']]));
  });

  it('a blank descripcion, then a blank abreviatura, show the desktop messages in that order', async () => {
    const user = await openAdd();
    await submit(user);
    expect(screen.getByText('Para agregar un Tipo de Movimiento de Inventario, debes especificar su Descripcion.')).toBeTruthy();
    await user.type(screen.getByLabelText('Descripción'), 'compra local');
    await submit(user);
    expect(screen.getByText('Para agregar un Tipo de Movimiento de Inventario, debes especificar su Abreviatura.')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Confirmar' })).toBeNull();
  });

  it('saves a complete form with the first clasificacion and no SUNAT code, and lists it', async () => {
    const user = await openAdd();
    await waitFor(() => expect(shown('Clasificacion')).toBe('COMPRA'));
    await user.type(screen.getByLabelText('Descripción'), 'compra local');
    await user.type(screen.getByLabelText('Abreviatura'), 'cl');
    await submit(user);
    await user.click(await screen.findByRole('button', { name: 'Confirmar' }));
    expect(await screen.findByText('COMPRA LOCAL')).toBeTruthy();
  });

  it('UPDATE restores the tipo, the clasificacion and the SUNAT tabla and detalle of the row', async () => {
    const user = await renderCatalog();
    await user.click(await screen.findByText('SALIDA PRODUCTOS VENTA'));
    await user.click(screen.getByRole('button', { name: 'Modificar' }));
    await screen.findByLabelText('Clasificacion');
    await waitFor(() => expect([select('Tipo').value, shown('Clasificacion'), shown('Tabla Sunat'), shown('Codigo Sunat')]).toEqual(['S', 'VENTA', 'TABLA 12 - TIPO DE OPERACION', 'VENTA']));
  });

  it('UPDATE keeps the saved clasificacion when it is not the first of its tipo, and leaves the empty SUNAT pair disabled', async () => {
    const { services, extra } = await setup();
    await services.catalog('tipos-mov-inventario').create({ tipo: 'E', id_clasif_inventario: extra.id_clasif_inventario, descripcion: 'AJUSTE EXTRA', abrev: 'AX' });
    show(services);
    const user = userEvent.setup();
    await user.click(await screen.findByText('AJUSTE EXTRA'));
    await user.click(screen.getByRole('button', { name: 'Modificar' }));
    await screen.findByLabelText('Clasificacion');
    await waitFor(() => expect([select('Tipo').value, shown('Clasificacion'), select('Codigo Sunat').disabled]).toEqual(['E', 'AJUSTE POSITIVO', true]));
  });
});

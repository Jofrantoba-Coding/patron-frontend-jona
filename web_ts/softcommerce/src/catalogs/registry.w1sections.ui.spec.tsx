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

/** The real `empresa` and `punto-venta` entries rendered over the demo seed of the W1 sections (R-REF-5, R-REF-6). */
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

describe('empresa register (S-REF-10, S-REF-4, S-REF-11)', () => {
  async function openModify() {
    const user = renderCatalog('empresa');
    await user.click(await screen.findByText('COMERCIAL DEMO SAC'));
    await user.click(screen.getByRole('button', { name: 'Modificar' }));
    await screen.findByLabelText('RUC');
    return user;
  }

  it('S-REF-11 offers modify and details only: no add, eliminate or clone', async () => {
    renderCatalog('empresa');
    await screen.findByText('COMERCIAL DEMO SAC');
    for (const name of ['Agregar', 'Eliminar', 'Clonar']) expect(screen.queryByRole('button', { name })).toBeNull();
    for (const name of ['Modificar', 'Detalle']) expect(screen.getByRole('button', { name })).toBeTruthy();
  });

  it('shows the stored fields, the ubigeo cascade restored from the distrito and the percepcion flag', async () => {
    await openModify();
    await waitFor(() => expect(select('Distrito').value).toBe('150101'));
    expect([field('Nombre').value, field('RUC').value, field('Website').value, select('Departamento').value, select('Provincia').value]).toEqual(['COMERCIAL DEMO SAC', '20123456789', 'www.comercialdemo.pe', '15', '1501']);
    expect((screen.getByLabelText('Agente de Percepcion') as HTMLInputElement).checked).toBe(false);
  });

  it('S-REF-10 letters typed in the RUC are ignored, and 10 digits block with the desktop RUC text', async () => {
    const user = await openModify();
    await user.clear(field('RUC'));
    await user.type(field('RUC'), '20a12345678');
    expect(field('RUC').value).toBe('2012345678');
    await user.click(within(dialog()).getByRole('button', { name: 'Aceptar' }));
    expect(screen.getByText('Para modificar una Empresa, debes especificar su RUC.')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Confirmar' })).toBeNull();
  });

  it('S-REF-4 website and correo show lower case as they are typed; the nombre is upper case', async () => {
    const user = await openModify();
    await user.clear(field('Website'));
    await user.type(field('Website'), 'WWW.Nuevo.COM');
    await user.clear(field('Correo'));
    await user.type(field('Correo'), 'Info@Nuevo.COM');
    expect([field('Website').value, field('Correo').value]).toEqual(['www.nuevo.com', 'info@nuevo.com']);
    await user.clear(field('Nombre'));
    await user.type(field('Nombre'), 'nueva sac');
    expect(field('Nombre').value).toBe('NUEVA SAC');
  });

  it('an optional cascade does not block: clearing the departamento saves the empresa without a ubigeo', async () => {
    const user = await openModify();
    await waitFor(() => expect(select('Distrito').value).toBe('150101'));
    await user.selectOptions(select('Departamento'), '');
    await user.click(within(dialog()).getByRole('button', { name: 'Aceptar' }));
    await user.click(await screen.findByRole('button', { name: 'Confirmar' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });
});

describe('punto de venta register (S-REF-32, S-REF-13 chain)', () => {
  async function openAdd() {
    const user = renderCatalog('punto-venta');
    await screen.findByText('TIENDA CENTRAL');
    await user.click(screen.getByRole('button', { name: 'Agregar' }));
    await screen.findByLabelText('Empresa');
    return user;
  }

  it('the localidad stays disabled until an empresa is chosen, then lists that empresa only', async () => {
    const user = await openAdd();
    expect(select('Localidad').disabled).toBe(true);
    await user.selectOptions(select('Empresa'), 'COMERCIAL DEMO SAC');
    await waitFor(() => expect(options('Localidad')).toEqual(['--- Seleccione ---', 'LOCAL CENTRAL', 'LOCAL ATE']));
    await user.selectOptions(select('Empresa'), 'DISTRIBUIDORA DEMO SRL');
    await waitFor(() => expect(options('Localidad')).toEqual(['--- Seleccione ---', 'ALMACEN CALLAO', 'SUCURSAL CUSCO']));
    expect(select('Localidad').value).toBe('');
  });

  it('a blank form says the empresa first, with the Punto de Venta entity [DEVIATION]', async () => {
    const user = await openAdd();
    await user.click(within(dialog()).getByRole('button', { name: 'Aceptar' }));
    expect(screen.getByText('Para agregar un Punto de Venta, debes especificar su Empresa.')).toBeTruthy();
  });

  it('S-REF-32 a blank telefono says su Telefono, and a long one is accepted as typed', async () => {
    const user = await openAdd();
    await user.selectOptions(select('Empresa'), 'COMERCIAL DEMO SAC');
    await waitFor(() => expect(options('Localidad')).toContain('LOCAL CENTRAL'));
    await user.selectOptions(select('Localidad'), 'LOCAL CENTRAL');
    await user.type(field('Descripción'), 'caja uno');
    await user.type(field('Dirección'), 'av. uno 100');
    await user.click(within(dialog()).getByRole('button', { name: 'Aceptar' }));
    expect(screen.getByText('Para agregar un Punto de Venta, debes especificar su Telefono.')).toBeTruthy();
    await user.type(field('Teléfono'), '9'.repeat(40));
    expect(field('Teléfono').value).toBe('9'.repeat(40));
  });

  it('S-REF-13 departamento and provincia without a distrito say su Distrito', async () => {
    const user = await openAdd();
    await user.selectOptions(select('Empresa'), 'COMERCIAL DEMO SAC');
    await waitFor(() => expect(options('Localidad')).toContain('LOCAL CENTRAL'));
    await user.selectOptions(select('Localidad'), 'LOCAL CENTRAL');
    await user.type(field('Descripción'), 'caja uno');
    await user.type(field('Dirección'), 'av. uno 100');
    await user.type(field('Teléfono'), '123');
    await user.click(within(dialog()).getByRole('button', { name: 'Aceptar' }));
    expect(screen.getByText('Para agregar un Punto de Venta, debes especificar su Departamento.')).toBeTruthy();
    await waitFor(() => expect(options('Departamento')).toContain('LIMA'));
    await user.selectOptions(select('Departamento'), 'LIMA');
    await waitFor(() => expect(options('Provincia')).toContain('LIMA'));
    await user.selectOptions(select('Provincia'), 'LIMA');
    await user.click(within(dialog()).getByRole('button', { name: 'Aceptar' }));
    expect(screen.getByText('Para agregar un Punto de Venta, debes especificar su Distrito.')).toBeTruthy();
  });

  it('saves a complete form and the list shows the new punto de venta with its names', async () => {
    const user = await openAdd();
    await user.selectOptions(select('Empresa'), 'COMERCIAL DEMO SAC');
    await waitFor(() => expect(options('Localidad')).toContain('LOCAL CENTRAL'));
    await user.selectOptions(select('Localidad'), 'LOCAL CENTRAL');
    await user.type(field('Descripción'), 'caja uno');
    await user.type(field('Dirección'), 'av. uno 100');
    await user.type(field('Teléfono'), '123');
    await waitFor(() => expect(options('Departamento')).toContain('LIMA'));
    await user.selectOptions(select('Departamento'), 'LIMA');
    await waitFor(() => expect(options('Provincia')).toContain('LIMA'));
    await user.selectOptions(select('Provincia'), 'LIMA');
    await waitFor(() => expect(options('Distrito')).toContain('LIMA'));
    await user.selectOptions(select('Distrito'), 'LIMA');
    await user.click(within(dialog()).getByRole('button', { name: 'Aceptar' }));
    await user.click(await screen.findByRole('button', { name: 'Confirmar' }));
    expect(await screen.findByText('CAJA UNO')).toBeTruthy();
  });
});

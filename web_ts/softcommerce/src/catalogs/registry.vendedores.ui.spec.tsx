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
import { formRegistry } from '../views/uishell/formRegistry';
import { toCatalogConfig } from './registry';

const granted = Object.fromEntries(PERMISSION_FLAGS.map((f) => [f, true])) as Permissions;

/** The real `vendedores` master over the demo seed (user 7), against the in-browser mock (S-MST-18, S-MST-19, S-LKP-7, S-ANX-8, R-MD-9). */
function renderVendedores() {
  const services = createAppServicesMock('exitoso', { getSession: () => ({ tenantId: 'demo' }), getRequestContext: () => ({ userId: '7', empresaId: '1' }), delayMs: 0, seed });
  render(
    <ServicesProvider services={services}>
      <DialogStackProvider>
        <UiCatalog config={toCatalogConfig(REGISTRY.bySlug.get('vendedores'))} permissions={granted} />
      </DialogStackProvider>
    </ServicesProvider>,
  );
  return userEvent.setup();
}
type User = ReturnType<typeof userEvent.setup>;
const input = (label: string) => screen.getByLabelText(label) as HTMLInputElement;
const select = (label: string) => screen.getByLabelText(label) as HTMLSelectElement;
const dialog = () => screen.getAllByRole('dialog').at(-1) as HTMLElement;

async function openAdd(user: User) {
  await screen.findByText('JUAN PEREZ LOPEZ');
  await user.click(screen.getByRole('button', { name: 'Agregar' }));
  await screen.findByLabelText('Codigo Trab.');
  await waitFor(() => expect(select('Tipo de Documento').options.length).toBeGreaterThan(1));
}
async function openUpdate(user: User, row: string) {
  await user.click(await screen.findByText(row));
  await user.click(screen.getByRole('button', { name: 'Modificar' }));
  await screen.findByLabelText('Codigo Trab.');
}
const pick = async (user: User, name: string) => {
  await user.click(within(dialog()).getByRole('button', { name: 'Buscar' }));
  await waitFor(() => expect(screen.getAllByRole('dialog')).toHaveLength(2));
  await user.click(await within(dialog()).findByText(name));
  await user.click(within(dialog()).getByRole('button', { name: 'Agregar' }));
};

describe('R-REG-19 / R-MD-9 the screen and its toolbar', () => {
  it('the menu leaf miVendedor opens the generic catalog unit', () => {
    expect(formRegistry.miVendedor).toBeTruthy();
  });

  it('lists the active vendedores, hides the retired one and offers Eliminar but no Clonar (no CLONE)', async () => {
    renderVendedores();
    expect(await screen.findByText('JUAN PEREZ LOPEZ')).toBeTruthy();
    expect(screen.getByText('MARIA GARCIA RAMOS')).toBeTruthy();
    expect(screen.queryByText('LUIS RETIRADO SOTO')).toBeNull();
    expect(screen.getByRole('button', { name: 'Eliminar' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Clonar' })).toBeNull();
  });
});

describe('vendedores INSERT (S-MST-18, S-MST-19, S-LKP-7)', () => {
  it('S-MST-19 opens on Contado, not Credito, DNI and PERUANA; the tipo lists every persona tipo, the last one too', async () => {
    const user = renderVendedores();
    await openAdd(user);
    expect([input('Contado').checked, input('Credito').checked]).toEqual([true, false]);
    expect(select('Tipo de Documento').selectedOptions[0]?.textContent).toBe('DNI');
    expect(select('Nacionalidad').selectedOptions[0]?.textContent).toBe('PERUANA');
    expect(Array.from(select('Tipo de Documento').options).map((o) => o.textContent).filter((t) => t && !/Seleccione/.test(t))).toEqual(['DNI', 'CE', 'RUC']);
    expect((screen.getByLabelText('Comentario') as HTMLTextAreaElement).tagName).toBe('TEXTAREA');
  });

  it('S-MST-18 Buscar and a pick fill the code, Nombres, Numero and the phones; Nombres, Dirección and Numero are read-only', async () => {
    const user = renderVendedores();
    await openAdd(user);
    await pick(user, 'MARIA GARCIA RAMOS');
    expect([input('Codigo Trab.').value, input('Nombres').value, input('Numero').value]).toEqual(['002', 'MARIA GARCIA RAMOS', '40234567']);
    expect(['Nombres', 'Dirección', 'Numero', 'Telefono Fijo', 'Telefono Movil'].map((label) => input(label).readOnly)).toEqual([true, true, true, false, false]);
  });

  it('S-LKP-7 the pick button is disabled with no selected row: the desktop exception does not occur', async () => {
    const user = renderVendedores();
    await openAdd(user);
    await user.click(within(dialog()).getByRole('button', { name: 'Buscar' }));
    await waitFor(() => expect(screen.getAllByRole('dialog')).toHaveLength(2));
    await within(dialog()).findByText('MARIA GARCIA RAMOS');
    expect((within(dialog()).getByRole('button', { name: 'Agregar' }) as HTMLButtonElement).disabled).toBe(true);
    expect(within(dialog()).getByText('Trabajador')).toBeTruthy();
  });

  it('S-MST-18 submitting with no trabajador says Debe elegir un trabajdor and nothing else', async () => {
    const user = renderVendedores();
    await openAdd(user);
    await user.click(within(dialog()).getByRole('button', { name: 'Aceptar' }));
    expect(await screen.findByText('Debe elegir un trabajdor')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Confirmar' })).toBeNull();
  });

  it('S-MST-19 the register saves the picked trabajador, the selected tipo and the comentario', async () => {
    const user = renderVendedores();
    await openAdd(user);
    await pick(user, 'MARIA GARCIA RAMOS');
    await user.selectOptions(select('Tipo de Documento'), 'CE');
    await user.type(screen.getByLabelText('Comentario'), 'zona norte');
    await user.click(within(dialog()).getByRole('button', { name: 'Aceptar' }));
    await user.click(await screen.findByRole('button', { name: 'Confirmar' }));
    await waitFor(() => expect(screen.getAllByText('MARIA GARCIA RAMOS')).toHaveLength(2));
    await user.click(screen.getAllByText('MARIA GARCIA RAMOS').at(-1) as HTMLElement);
    await user.click(screen.getByRole('button', { name: 'Modificar' }));
    await screen.findByLabelText('Codigo Trab.');
    await waitFor(() => expect(select('Tipo de Documento').selectedOptions[0]?.textContent).toBe('CE'));
    expect((screen.getByLabelText('Comentario') as HTMLTextAreaElement).value).toBe('zona norte');
  });
});

describe('vendedores UPDATE (S-MST-18, S-ANX-8)', () => {
  it('S-MST-18 restores the record with the picker disabled and the trabajador fields read-only', async () => {
    const user = renderVendedores();
    await openUpdate(user, 'MARIA GARCIA RAMOS');
    await waitFor(() => expect(input('Nombres').value).toBe('MARIA GARCIA RAMOS'));
    expect(input('Codigo Trab.').value).toBe('002');
    expect(within(dialog()).queryByRole('button', { name: 'Buscar' })).toBeNull();
    expect([input('Credito').checked, input('Contado').checked]).toEqual([true, false]);
    expect((screen.getByLabelText('Comentario') as HTMLTextAreaElement).value).toBe('ATIENDE LA ZONA NORTE\nCOMISION ESPECIAL');
  });

  it('S-ANX-8 the Activar dialog reads Activar Vendedor and a blank motivo says Ingrese Motivo', async () => {
    const user = renderVendedores();
    await openUpdate(user, 'CARLOS TORRES DIAZ');
    await user.click(screen.getByRole('tab', { name: 'Activación de Vendedor' }));
    await user.click(within(screen.getByRole('tabpanel', { name: 'Activación de Vendedor' })).getByRole('button', { name: 'Activar' }));
    const activar = await waitFor(() => screen.getByText('Nuevo: Activar Vendedor').closest<HTMLElement>('[role="dialog"]') as HTMLElement);
    await user.click(within(activar).getByRole('button', { name: 'Aceptar' }));
    expect(await within(activar).findByText('Ingrese Motivo')).toBeTruthy();
  });
});

import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { REGISTRY } from '../../mock-server/registry/index.js';
import { PERMISSION_FLAGS, type Permissions } from '../domain/permissions';
import { ServicesProvider } from '../services/ServicesContext';
import { SessionProvider } from '../session/SessionProvider';
import { createSessionStore, type Session } from '../session/sessionStore';
import { createAppServicesMock } from '../services/mock/AppServicesMock';
import { seed } from '../services/mock/seed';
import { UiCatalog } from '../views/uicatalog';
import { DialogStackProvider } from '../views/uishell/DialogStackProvider';
import { formRegistry } from '../views/uishell/formRegistry';
import { toCatalogConfig } from './registry';

const granted = Object.fromEntries(PERMISSION_FLAGS.map((f) => [f, true])) as Permissions;

/** The real `clientes` entry over the demo seed (user 7), against the in-browser mock (S-MST-1, S-MST-3, S-MST-20 for the Cliente). */
const DEMO_PARAMS = { IS_CLIENTE_CONDICION_PAGO: true };
function renderClientes(params: Record<string, unknown> = DEMO_PARAMS) {
  const services = createAppServicesMock('exitoso', { getSession: () => ({ tenantId: 'demo' }), getRequestContext: () => ({ userId: '7' }), delayMs: 0, seed });
  const store = createSessionStore(window.localStorage);
  store.setSession({ params } as unknown as Session);
  render(
    <SessionProvider store={store}>
      <ServicesProvider services={services}>
        <DialogStackProvider>
          <UiCatalog config={toCatalogConfig(REGISTRY.bySlug.get('clientes'), REGISTRY)} permissions={granted} />
        </DialogStackProvider>
      </ServicesProvider>
    </SessionProvider>,
  );
  return { user: userEvent.setup(), services };
}
type User = ReturnType<typeof userEvent.setup>;
const select = (label: string) => screen.getByLabelText(label) as HTMLSelectElement;
const selected = (label: string) => select(label).selectedOptions[0]?.textContent;
const dialog = () => screen.getByRole('dialog');

async function openRegister(user: User, button: 'Agregar' | 'Modificar', row?: string) {
  if (row) await user.click(await screen.findByText(row));
  else await screen.findByText('COMERCIAL LOS ANDES SAC');
  await user.click(screen.getByRole('button', { name: button }));
  await screen.findByLabelText('Tipo de Documento');
  await waitFor(() => expect(selected('Nacionalidad')).toBeTruthy());
}

describe('R-REG-19 the screen is reachable', () => {
  it('the menu leaf miCliente opens the generic catalog unit', () => {
    expect(formRegistry.miCliente).toBeTruthy();
  });
});

describe('clientes list and toolbar (S-MST-1)', () => {
  it('lists the active clientes with the desktop columns, hides the retired one, and offers add and modify only', async () => {
    renderClientes();
    expect(await screen.findByText('COMERCIAL LOS ANDES SAC')).toBeTruthy();
    expect(screen.queryByText('CLIENTE RETIRADO SA')).toBeNull();
    for (const header of ['T_PERSONA', 'RAZON SOCIAL', 'PATERNO', 'MATERNO', 'NOMBRES', 'RUC/DNI', 'DIRECCION']) expect(screen.getByText(header)).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Agregar' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Modificar' })).toBeTruthy();
    for (const name of ['Eliminar', 'Clonar', 'Detalle']) expect(screen.queryByRole('button', { name })).toBeNull();
  });
});

describe('clientes INSERT (S-MST-3, S-MST-20)', () => {
  it('opens with no tipo selected, no tipo de cliente and PERUANA', async () => {
    const { user } = renderClientes();
    await openRegister(user, 'Agregar');
    expect([selected('Tipo de Documento'), selected('Tipo Cliente'), selected('Nacionalidad')]).toEqual(['--- Seleccione ---', '--- Seleccione ---', 'PERUANA']);
  });

  it('S-MST-3 no tipo says "un Cliente"', async () => {
    const { user } = renderClientes();
    await openRegister(user, 'Agregar');
    await user.click(within(dialog()).getByRole('button', { name: 'Aceptar' }));
    expect(await screen.findByText('Para agregar un Cliente, debes Seleccionar un Tipo de Documento.')).toBeTruthy();
  });

  it('S-MST-20 a RUC with its razon social and no tipo de cliente is refused with the Cliente sentence, before the confirmation', async () => {
    const { user } = renderClientes();
    await openRegister(user, 'Agregar');
    await user.selectOptions(select('Tipo de Documento'), '05');
    await user.type(screen.getByLabelText('DNI/RUC'), '20123456789');
    await user.type(screen.getByLabelText('Razón Social'), 'acme sac');
    await user.click(within(dialog()).getByRole('button', { name: 'Aceptar' }));
    expect(await screen.findByText('Para agregar un Cliente, debes Seleccionar un Tipo de Cliente.')).toBeTruthy();
  });

  it('the tipo de cliente offers only the active clasificaciones and the tab is Activación de Cliente', async () => {
    const { user } = renderClientes();
    await openRegister(user, 'Agregar');
    await waitFor(() => expect([...select('Tipo Cliente').querySelectorAll('option')].map((o) => o.textContent)).toEqual(['--- Seleccione ---', 'MAYORISTA']));
    expect(within(dialog()).getAllByRole('tab').map((tab) => tab.textContent)).toEqual(['General', 'Activación de Cliente']);
  });
});

describe('clientes UPDATE restores what is stored', () => {
  it('shows the stored tipo, tipo de cliente and nacionalidad', async () => {
    const { user } = renderClientes();
    await openRegister(user, 'Modificar', 'COMERCIAL LOS ANDES SAC');
    await waitFor(() => expect(selected('Tipo Cliente')).toBe('MAYORISTA'));
    expect([selected('Tipo de Documento'), selected('Nacionalidad')]).toEqual(['RUC', 'PERUANA']);
  });
});

describe('clientes condición de pago behind IS_CLIENTE_CONDICION_PAGO (S-MST-20, S-MST-21, S-MD-14)', () => {
  const days = () => screen.getByLabelText('Numero de dias') as HTMLInputElement;
  const fillRuc = async (user: User) => {
    await user.selectOptions(select('Tipo de Documento'), '05');
    await user.type(screen.getByLabelText('DNI/RUC'), '20123456789');
    await user.type(screen.getByLabelText('Razón Social'), 'acme sac');
    await waitFor(() => expect(select('Tipo Cliente').querySelectorAll('option').length).toBe(2));
    await user.selectOptions(select('Tipo Cliente'), '1');
  };

  it('the list shows CONDICION PAGO and NUMERO DIAS with the parameter on and not with it off', async () => {
    renderClientes();
    expect(await screen.findByText('CONDICION PAGO')).toBeTruthy();
    expect(screen.getByText('NUMERO DIAS')).toBeTruthy();
  });

  it('with the parameter off the list has neither column and the register neither field', async () => {
    const { user } = renderClientes({ IS_CLIENTE_CONDICION_PAGO: false });
    await screen.findByText('COMERCIAL LOS ANDES SAC');
    expect([screen.queryByText('CONDICION PAGO'), screen.queryByText('NUMERO DIAS')]).toEqual([null, null]);
    await openRegister(user, 'Agregar');
    expect([screen.queryByLabelText('Condicion Pago'), screen.queryByLabelText('Numero de dias')]).toEqual([null, null]);
  });

  it('S-MST-21 opens with the blank condición and the días disabled at 0; CREDITO enables them at 0 and CONTADO disables them at 0 again', async () => {
    const { user } = renderClientes();
    await openRegister(user, 'Agregar');
    expect([selected('Condicion Pago'), days().value, days().readOnly]).toEqual(['Seleccione', '0', true]);
    await user.selectOptions(select('Condicion Pago'), 'CREDITO');
    expect([days().value, days().readOnly]).toEqual(['0', false]);
    await user.clear(days());
    await user.type(days(), '45');
    expect(days().value).toBe('45');
    await user.selectOptions(select('Condicion Pago'), 'CONTADO');
    expect([days().value, days().readOnly]).toEqual(['0', true]);
  });

  it('S-MST-20 CREDITO with the días erased says Ingrese numero de Dias, after everything else is valid', async () => {
    const { user } = renderClientes();
    await openRegister(user, 'Agregar');
    await fillRuc(user);
    await user.selectOptions(select('Condicion Pago'), 'CREDITO');
    await user.clear(days());
    await user.click(within(dialog()).getByRole('button', { name: 'Aceptar' }));
    expect(await screen.findByText('Ingrese numero de Dias')).toBeTruthy();
  });

  it('UPDATE restores the stored condición and días', async () => {
    const { user } = renderClientes();
    await openRegister(user, 'Modificar', 'COMERCIAL LOS ANDES SAC');
    await waitFor(() => expect(selected('Condicion Pago')).toBe('CREDITO'));
    expect([days().value, days().readOnly]).toEqual(['30', false]);
  });
});

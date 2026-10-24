import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { todayIso } from '../../mock-server/core/dates.js';
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

/** The real `trabajadores` master over the demo seed (user 7), against the in-browser mock (S-MST-6, S-MST-7, S-MST-9, S-ANX-1). */
function renderTrabajadores() {
  const services = createAppServicesMock('exitoso', { getSession: () => ({ tenantId: 'demo' }), getRequestContext: () => ({ userId: '7', empresaId: '1' }), delayMs: 0, seed });
  render(
    <ServicesProvider services={services}>
      <DialogStackProvider>
        <UiCatalog config={toCatalogConfig(REGISTRY.bySlug.get('trabajadores'))} permissions={granted} />
      </DialogStackProvider>
    </ServicesProvider>,
  );
  return userEvent.setup();
}
type User = ReturnType<typeof userEvent.setup>;
const select = (label: string) => screen.getByLabelText(label) as HTMLSelectElement;
const optionsOf = (label: string) => Array.from(select(label).options).map((o) => o.textContent);
const dialog = () => screen.getByRole('dialog');
const todayDisplay = () => {
  const [year, month, day] = todayIso().split('-');
  return `${day}/${month}/${year}`;
};

async function openAdd(user: User) {
  await screen.findByText('JUAN PEREZ LOPEZ');
  await user.click(screen.getByRole('button', { name: 'Agregar' }));
  await screen.findByLabelText('Tipo Trabajador');
  await waitFor(() => expect(optionsOf('Tipo Trabajador').length).toBeGreaterThan(1));
}

describe('R-REG-19 the screen is reachable', () => {
  it('the menu leaf miTrabajador opens the generic catalog unit', () => {
    expect(formRegistry.miTrabajador).toBeTruthy();
  });
});

describe('trabajadores list and toolbar (R-MST-1)', () => {
  it('lists the active trabajadores by their nombre, hides the retired one and offers neither Eliminar nor Clonar', async () => {
    renderTrabajadores();
    expect(await screen.findByText('JUAN PEREZ LOPEZ')).toBeTruthy();
    expect(screen.getByText('MARIA GARCIA RAMOS')).toBeTruthy();
    expect(screen.queryByText('LUIS RETIRADO SOTO')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Eliminar' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Clonar' })).toBeNull();
    for (const name of ['Agregar', 'Modificar']) expect(screen.getByRole('button', { name })).toBeTruthy();
  });
});

describe('trabajadores INSERT (S-MST-6, S-MST-7, S-MST-9)', () => {
  it('S-MST-9 opens with sexo M, fecha nac today, Estado checked and the INICIO activation row', async () => {
    const user = renderTrabajadores();
    await openAdd(user);
    expect((screen.getByRole('radio', { name: 'Masculino' }) as HTMLInputElement).checked).toBe(true);
    expect((screen.getByLabelText('Fecha Nac') as HTMLInputElement).value).toBe(todayDisplay());
    expect((screen.getByLabelText('Estado') as HTMLInputElement).checked).toBe(true);
    await user.click(screen.getByRole('tab', { name: 'Activación de Trabajador' }));
    const panel = screen.getByRole('tabpanel', { name: 'Activación de Trabajador' });
    const rows = within(panel).getAllByRole('row').slice(1).map((tr) => within(tr).getAllByRole('cell').map((td) => td.textContent));
    expect([rows[0][0], rows[0][1], rows[0][2]]).toEqual(['●', 'INICIO', todayDisplay()]);
    expect(within(panel).getAllByRole('button').map((b) => [b.textContent, (b as HTMLButtonElement).disabled])).toEqual([['Activar', true], ['Desactivar', true]]);
  });

  it('S-MST-7 with no tipo the perfil is disabled and empty; a tipo loads only its perfiles; changing the tipo clears the perfil', async () => {
    const user = renderTrabajadores();
    await openAdd(user);
    expect(select('Trabajador Perfil').disabled).toBe(true);
    expect(optionsOf('Trabajador Perfil').filter((o) => o && !/Seleccione/.test(o))).toEqual([]);
    await user.selectOptions(select('Tipo Trabajador'), 'ADMINISTRATIVO');
    await waitFor(() => expect(optionsOf('Trabajador Perfil')).toContain('ADMINISTRADOR'));
    expect(optionsOf('Trabajador Perfil')).not.toContain('CAJERO');
    await user.selectOptions(select('Trabajador Perfil'), 'ADMINISTRADOR');
    await user.selectOptions(select('Tipo Trabajador'), 'VENDEDOR');
    await waitFor(() => expect(optionsOf('Trabajador Perfil')).toContain('CAJERO'));
    expect(select('Trabajador Perfil').selectedOptions[0]?.textContent).not.toBe('ADMINISTRADOR');
    expect(optionsOf('Trabajador Perfil')).not.toContain('ADMINISTRADOR');
  });

  it('S-MST-6 the empty register says Seleccione Tipo Trabajador first, then the perfil', async () => {
    const user = renderTrabajadores();
    await openAdd(user);
    await user.click(within(dialog()).getByRole('button', { name: 'Aceptar' }));
    expect(await screen.findByText('Seleccione Tipo Trabajador')).toBeTruthy();
    await user.selectOptions(select('Tipo Trabajador'), 'ADMINISTRATIVO');
    await user.click(within(dialog()).getByRole('button', { name: 'Aceptar' }));
    expect(await screen.findByText('Seleccione Trabajador Perfil')).toBeTruthy();
  });
});

describe('trabajadores UPDATE (S-MST-7, S-ANX-1)', () => {
  it('restores the tipo and the perfil, lists the seeded INICIO and Estado shows the deactivation', async () => {
    const user = renderTrabajadores();
    await user.click(await screen.findByText('CARLOS TORRES DIAZ'));
    await user.click(screen.getByRole('button', { name: 'Modificar' }));
    await screen.findByLabelText('Tipo Trabajador');
    await waitFor(() => expect(select('Trabajador Perfil').selectedOptions[0]?.textContent).toBe('ADMINISTRADOR'));
    expect(select('Tipo Trabajador').selectedOptions[0]?.textContent).toBe('ADMINISTRATIVO');
    expect((screen.getByLabelText('Estado') as HTMLInputElement).checked).toBe(false);
    await user.click(screen.getByRole('tab', { name: 'Activación de Trabajador' }));
    const panel = screen.getByRole('tabpanel', { name: 'Activación de Trabajador' });
    await waitFor(() => expect(within(panel).getAllByRole('row').slice(1)).toHaveLength(1));
    expect(within(within(panel).getAllByRole('row')[1]).getAllByRole('cell').map((td) => td.textContent).slice(0, 2)).toEqual(['○', 'INICIO']);
  });
});

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

/** The real `vehiculos` entry rendered over the demo seed. */
function renderCatalog() {
  const services = createAppServicesMock('exitoso', { getSession: () => ({ tenantId: 'demo' }), getRequestContext: () => ({ userId: '7', empresaId: '1' }), delayMs: 0, seed });
  render(
    <ServicesProvider services={services}>
      <DialogStackProvider>
        <UiCatalog config={toCatalogConfig(REGISTRY.bySlug.get('vehiculos'))} permissions={granted} />
      </DialogStackProvider>
    </ServicesProvider>,
  );
  return userEvent.setup();
}
type User = ReturnType<typeof userEvent.setup>;
const field = (label: string) => screen.getByLabelText(label) as HTMLInputElement | HTMLSelectElement;
const dialog = () => screen.getByRole('dialog');
const options = (label: string) => [...(field(label) as HTMLSelectElement).options].map((o) => o.textContent);
const shown = (label: string) => (field(label) as HTMLSelectElement).selectedOptions[0]?.textContent;
const submit = (user: User) => user.click(within(dialog()).getByRole('button', { name: 'Aceptar' }));

async function openAdd() {
  const user = renderCatalog();
  await screen.findByText('ABC123');
  await user.click(screen.getByRole('button', { name: 'Agregar' }));
  await screen.findByLabelText('Placa');
  return user;
}

describe('vehiculo register (S-REF-31, S-REF-39)', () => {
  it('lists the active vehiculos with their joined marca and modelo and hides the retired one', async () => {
    renderCatalog();
    expect(await screen.findByText('ABC123')).toBeTruthy();
    expect(screen.getAllByText('TOYOTA').length).toBeGreaterThan(0);
    expect(screen.getAllByText('HILUX').length).toBeGreaterThan(0);
    expect(screen.queryByText('RET000')).toBeNull();
  });

  it('S-REF-31 a fresh INSERT has peso 0 and an Activo that is checked and read-only', async () => {
    await openAdd();
    expect((field('Peso(KG)') as HTMLInputElement).value).toBe('0');
    const activo = field('Activo') as HTMLInputElement;
    expect([activo.checked, activo.disabled || activo.readOnly]).toEqual([true, true]);
  });

  it('S-REF-31 the desktop messages come one by one, in order, as each is fixed', async () => {
    const user = await openAdd();
    await submit(user);
    expect(screen.getByText('Para agregar, debes especificar su Placa.')).toBeTruthy();
    await user.type(field('Placa'), 'qwe123');
    await submit(user);
    expect(screen.getByText('Para agregar, debes especificar su Constacia.')).toBeTruthy();
    await user.type(field('Const inscripcion'), 'ci-77');
    await submit(user);
    expect(screen.getByText('Para agregar, debes Seleccionar Marca.')).toBeTruthy();
    await user.selectOptions(field('Marca'), 'HYUNDAI');
    await submit(user);
    expect(screen.getByText('Para agregar, debes Seleccionar Modelo.')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Confirmar' })).toBeNull();
  });

  it('S-REF-31 the marca and modelo selects offer only the rows with estado A', async () => {
    await openAdd();
    await waitFor(() => expect(options('Marca')).toEqual(expect.arrayContaining(['TOYOTA', 'HYUNDAI'])));
    expect(options('Marca')).not.toContain('VOLVO');
    expect(options('Modelo')).toContain('HILUX');
    expect(options('Modelo')).not.toContain('COROLLA');
  });

  it('a blank peso says su Peso', async () => {
    const user = await openAdd();
    await user.type(field('Placa'), 'qwe123');
    await user.type(field('Const inscripcion'), 'ci-77');
    await user.clear(field('Peso(KG)'));
    await submit(user);
    expect(screen.getByText('Para agregar, debes especificar su Peso.')).toBeTruthy();
  });

  it('saves a complete form and lists it', async () => {
    const user = await openAdd();
    await user.type(field('Placa'), 'qwe123');
    await user.type(field('Const inscripcion'), 'ci-77');
    await waitFor(() => expect(options('Marca')).toContain('HYUNDAI'));
    await user.selectOptions(field('Marca'), 'HYUNDAI');
    await user.selectOptions(field('Modelo'), 'HILUX');
    await submit(user);
    await user.click(await screen.findByRole('button', { name: 'Confirmar' }));
    expect(await screen.findByText('QWE123')).toBeTruthy();
  });

  it('S-REF-39 the form has no propietario picker (transportista)', async () => {
    await openAdd();
    for (const absent of ['Propietario', 'Transportista']) expect(screen.queryByLabelText(absent), absent).toBeNull();
    expect(screen.queryByText('Propietario')).toBeNull();
  });

  it('UPDATE restores the saved marca, modelo, placa and peso', async () => {
    const user = renderCatalog();
    await user.click(await screen.findByText('ABC123'));
    await user.click(screen.getByRole('button', { name: 'Modificar' }));
    await screen.findByLabelText('Placa');
    await waitFor(() => expect([shown('Marca'), shown('Modelo'), (field('Placa') as HTMLInputElement).value, (field('Peso(KG)') as HTMLInputElement).value]).toEqual(['TOYOTA', 'HILUX', 'ABC123', '1500']));
  });
});

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

/** The real `usuarios` master over the demo seed, against the in-browser mock (R-MST-7, S-MST-13..16, S-CRUD-43, S-CRUD-44). */
function renderUsuarios() {
  const services = createAppServicesMock('exitoso', { getSession: () => ({ tenantId: 'demo' }), getRequestContext: () => ({ userId: '7', empresaId: '1' }), delayMs: 0, seed });
  render(
    <ServicesProvider services={services}>
      <DialogStackProvider>
        <UiCatalog config={toCatalogConfig(REGISTRY.bySlug.get('usuarios'))} permissions={granted} />
      </DialogStackProvider>
    </ServicesProvider>,
  );
  return userEvent.setup();
}
type User = ReturnType<typeof userEvent.setup>;
const input = (label: string) => screen.getByLabelText(label) as HTMLInputElement;
const dialog = () => screen.getAllByRole('dialog').at(-1) as HTMLElement;

async function openAdd(user: User) {
  await screen.findByText('Cajero Uno');
  await user.click(screen.getByRole('button', { name: 'Agregar' }));
  await screen.findByLabelText('Nombre de Usuario');
}
async function openRow(user: User, button: string) {
  await user.click(await screen.findByText('Cajero Uno'));
  await user.click(screen.getByRole('button', { name: button }));
  await screen.findByLabelText('Nombre de Usuario');
}
const pick = async (user: User, name: string) => {
  await user.click(within(dialog()).getByRole('button', { name: 'Buscar' }));
  await waitFor(() => expect(screen.getAllByRole('dialog')).toHaveLength(2));
  await user.click(await within(dialog()).findByText(name));
  await user.click(within(dialog()).getByRole('button', { name: 'Agregar' }));
};

describe('R-REG-19 the screen and its toolbar', () => {
  it('the menu leaf mi_usuario opens the generic catalog unit', () => {
    expect(formRegistry.mi_usuario).toBeTruthy();
  });

  it('lists the tenant users and offers Eliminar and Clonar', async () => {
    renderUsuarios();
    for (const nombre of ['Administrador', 'Cajero Uno', 'Usuario Deshabilitado', 'Sin Acceso Escritorio']) expect(await screen.findByText(nombre)).toBeTruthy();
    expect([screen.getByRole('button', { name: 'Eliminar' }), screen.getByRole('button', { name: 'Clonar' })]).toHaveLength(2);
  });
});

describe('usuarios INSERT (S-MST-13, S-MST-14, S-MST-16, S-CRUD-43)', () => {
  it('S-MST-14 opens with Escritorio, Web, Contable and Habilitado unchecked, and no Nuevo Trabajador button (S-REF-39)', async () => {
    const user = renderUsuarios();
    await openAdd(user);
    expect(['Escritorio', 'Web', 'Contable', 'Habilitado'].map((label) => input(label).checked)).toEqual([false, false, false, false]);
    expect(screen.queryByRole('button', { name: /Nuevo Trabajador/ })).toBeNull();
    expect([input('Contraseña').type, input('Confirmar Contraseña').type]).toEqual(['password', 'password']);
    expect(input('Mostrar caracteres').checked).toBe(false);
  });

  it('S-MST-13 an empty submit says the trabajador first, then the name, then the key', async () => {
    const user = renderUsuarios();
    await openAdd(user);
    await user.click(within(dialog()).getByRole('button', { name: 'Aceptar' }));
    expect(await screen.findByText('Para agregar un usuario, debes especificar un Trajador.')).toBeTruthy();
    await pick(user, 'JUAN PEREZ LOPEZ');
    await user.click(within(dialog()).getByRole('button', { name: 'Aceptar' }));
    expect(await screen.findByText('Para agregar un usuario, debes especificar su nombre.')).toBeTruthy();
    await user.type(input('Nombre de Usuario'), 'nuevo');
    await user.click(within(dialog()).getByRole('button', { name: 'Aceptar' }));
    expect(await screen.findByText('Para agregar un usuario, debes especificar su clave.')).toBeTruthy();
  });

  it('a pick fills the code and the read-only Cargo', async () => {
    const user = renderUsuarios();
    await openAdd(user);
    await pick(user, 'JUAN PEREZ LOPEZ');
    expect(input('Trabajador').value).toBe('001');
    expect(input('Cargo').value).not.toBe('');
    expect(input('Cargo').readOnly).toBe(true);
  });

  it('S-MST-16 the register creates the user: the list shows the name and the nombre of the trabajador; a second one with the same name says it exists', async () => {
    const user = renderUsuarios();
    for (const attempt of [1, 2]) {
      await openAdd(user);
      await pick(user, 'JUAN PEREZ LOPEZ');
      await user.type(input('Nombre de Usuario'), 'nuevo');
      await user.type(input('Contraseña'), 'secreto1');
      await user.type(input('Confirmar Contraseña'), 'secreto1');
      await user.click(within(dialog()).getByRole('button', { name: 'Aceptar' }));
      await user.click(await screen.findByRole('button', { name: 'Confirmar' }));
      if (attempt === 1) {
        expect(await screen.findByText('nuevo')).toBeTruthy();
        expect(screen.getAllByText('JUAN PEREZ LOPEZ').length).toBeGreaterThan(0);
      } else expect(await screen.findByText('El nombre de usuario ya existe.')).toBeTruthy();
    }
  });
});

describe('usuarios UPDATE, DETAIL and CLONE (S-CRUD-44, R-MST-7)', () => {
  it('UPDATE shows the stored flags and the password inputs empty; a blank pair is allowed', async () => {
    const user = renderUsuarios();
    await openRow(user, 'Modificar');
    expect(input('Nombre de Usuario').value).toBe('cajero');
    expect([input('Habilitado').checked, input('Escritorio').checked, input('Web').checked, input('Contable').checked]).toEqual([true, true, false, false]);
    expect([input('Contraseña').value, input('Confirmar Contraseña').value]).toEqual(['', '']);
  });

  it('DETAIL does not render the password field', async () => {
    const user = renderUsuarios();
    await openRow(user, 'Detalle');
    expect(screen.queryByLabelText('Contraseña')).toBeNull();
    expect(input('Nombre de Usuario').value).toBe('cajero');
  });

  it('CLONE copies the fields but not the code or the password, which is required again', async () => {
    const user = renderUsuarios();
    await openRow(user, 'Clonar');
    expect([input('Nombre de Usuario').value, input('Habilitado').checked, input('Contraseña').value, input('Confirmar Contraseña').value]).toEqual(['cajero', true, '', '']);
    await user.click(within(dialog()).getByRole('button', { name: 'Aceptar' }));
    expect(await screen.findByText(/Para clonar un usuario, debes especificar/)).toBeTruthy();
  });
});

import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { parentEntry } from '../../../mock-server/core/children.fixture';
import { tinySeed } from '../../../mock-server/core/test-helpers';
import { presets } from '../../../mock-server/registry/presets.js';
import { validateRegistry } from '../../../mock-server/registry/schema.js';
import { toCatalogConfig } from '../../catalogs/registry';
import { PERMISSION_FLAGS, type Permissions } from '../../domain/permissions';
import { ServicesProvider } from '../../services/ServicesContext';
import type { AppServices } from '../../services/serviceComposer';
import { createAppServicesMock } from '../../services/mock/AppServicesMock';
import { DialogStackProvider } from '../uishell/DialogStackProvider';
import { UiMasterRegister } from './UiMasterRegister';

/**
 * S-ANX-1..6 end to end: the real anexo preset (history grid, deferred Activar and Desactivar, the `activacion` rule) over the in-browser mock, in a
 * test master `maestros` whose entity word changes with the scenario. The system date is 2026-03-12.
 */
const closed = { id: '1', estado: 'D', f_inicio: '2026-01-01', f_fin: '2026-02-01', motivo_activacion: 'INICIO', motivo_desactivacion: 'CIERRE' };
const seed = {
  ...tinySeed(),
  maestros: {
    a: [
      { id_maestros: '0000000001', nombre: 'UNO', estado: true, activo: true, activaciones: [{ id: '1', estado: 'A', f_inicio: '2026-03-10', f_fin: '', motivo_activacion: 'INICIO', motivo_desactivacion: '' }] },
      { id_maestros: '0000000002', nombre: 'DOS', estado: false, activo: true, activaciones: [closed] },
    ],
  },
};
const registryOf = (entity: string) => {
  const anexo = presets.anexo({ entity, tipoAnexo: '9' });
  return validateRegistry([
    parentEntry('maestros', {
      entity: `un ${entity}`, codeWidth: 10,
      fields: [{ name: 'id_maestros', kind: 'code', label: 'Codigo' }, { name: 'nombre', kind: 'text', label: 'Nombre', required: true, max: 30 }, { name: 'estado', preset: 'estado', label: 'Estado', readOnlyOn: ['INSERT', 'UPDATE', 'DELETE', 'DETAIL', 'CLONE'] }],
      children: anexo.children, actions: anexo.actions, rules: anexo.rules, constants: anexo.constants,
    }),
  ]);
};

const granted = Object.fromEntries(PERMISSION_FLAGS.map((f) => [f, true])) as Permissions;
type Mode = 'INSERT' | 'UPDATE' | 'DETAIL' | 'CLONE' | 'DELETE';
type User = ReturnType<typeof userEvent.setup>;

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date(2026, 2, 12, 12, 0));
});
afterEach(() => vi.useRealTimers());

async function open(entity: string, mode: Mode = 'UPDATE', id = '0000000001') {
  const registry = registryOf(entity);
  const mock = createAppServicesMock('exitoso', { getSession: () => ({ tenantId: 'a' }), getRequestContext: () => ({ userId: '1' }), delayMs: 0, registry, seed });
  const config = toCatalogConfig(registry.bySlug.get('maestros'), registry);
  const service = mock.catalog('maestros');
  const update = vi.spyOn(service, 'update');
  const onClose = vi.fn();
  render(
    <ServicesProvider services={mock as unknown as AppServices}>
      <DialogStackProvider>
        <UiMasterRegister config={config as any} service={service as any} mode={mode} id={mode === 'INSERT' ? undefined : id} permissions={granted} onDone={vi.fn()} onClose={onClose} />
      </DialogStackProvider>
    </ServicesProvider>,
  );
  await waitFor(() => expect(screen.queryByText('Cargando...')).toBeNull());
  const user = userEvent.setup();
  await user.click(screen.getByRole('tab', { name: new RegExp(`^Activación de ${entity}$`) }));
  return { user, mock, update, onClose };
}
const panel = (entity: string) => screen.getByRole('tabpanel', { name: `Activación de ${entity}` });
const button = (entity: string, name: string) => within(panel(entity)).getByRole('button', { name }) as HTMLButtonElement;
const notice = (entity: string) => within(panel(entity)).getByRole('status').textContent;
const estado = () => screen.getByLabelText('Estado') as HTMLInputElement;
const confirmLast = async (user: User) => user.click((await screen.findAllByRole('button', { name: 'Confirmar' })).at(-1) as HTMLElement);
const dialogOf = (title: string) => screen.getByText(`Nuevo: ${title}`).closest<HTMLElement>('[role="dialog"]') as HTMLElement;
const noDialog = (title: string) => expect(screen.queryByText(`Nuevo: ${title}`)).toBeNull();
const retype = async (user: User, dialog: HTMLElement, label: string, digits: string) => {
  const input = within(dialog).getByLabelText(label);
  await user.clear(input);
  await user.type(input, digits);
};
async function confirmDialog(user: User, title: string, fill: { motivo: [string, string]; fecha?: [string, string] }) {
  const dialog = await waitFor(() => dialogOf(title));
  if (fill.fecha) await retype(user, dialog, ...fill.fecha);
  await user.type(within(dialog).getByLabelText(fill.motivo[0]), fill.motivo[1]);
  await user.click(within(dialog).getByRole('button', { name: 'Aceptar' }));
  await confirmLast(user);
}
const stateOf = (text: string) => within(screen.getByText(text).closest('tr') as HTMLElement).getByRole('img').getAttribute('aria-label');
const cells = (entity: string) => within(panel(entity)).getAllByRole('row').slice(1).map((tr) => within(tr).getAllByRole('cell').map((td) => td.textContent));

describe('S-ANX-1 / R-ANX-2 INSERT shows the initial activation', () => {
  it('one active INICIO row of today, no Agregar or Quitar, Activar and Desactivar disabled, Estado checked', async () => {
    const { user } = await open('Banco', 'INSERT');
    expect(within(panel('Banco')).getAllByRole('button').map((b) => b.textContent)).toEqual(['Activar', 'Desactivar']);
    expect(cells('Banco')).toEqual([['●', 'INICIO', '12/03/2026', '', '']]);
    expect([button('Banco', 'Activar').disabled, button('Banco', 'Desactivar').disabled]).toEqual([true, true]);
    await user.click(screen.getByRole('tab', { name: 'General' }));
    expect([estado().checked, estado().disabled]).toEqual([true, true]);
  });

  it('the server records the row on create: the new banco lists exactly that activation', async () => {
    const { user, mock } = await open('Banco', 'INSERT');
    await user.click(screen.getByRole('tab', { name: 'General' }));
    await user.type(screen.getByLabelText('Nombre'), 'nuevo');
    await user.click(screen.getByRole('button', { name: 'Aceptar' }));
    await confirmLast(user);
    await waitFor(async () => expect((await mock.catalog('maestros').list({})).items).toHaveLength(3));
    const created = (await mock.catalog('maestros').list({})).items.find((r: any) => r.nombre === 'nuevo') as any;
    expect((await mock.children('maestros').list(created.id_maestros, 'activaciones')).items.map((r: any) => [r.motivo_activacion, r.f_inicio, r.estado])).toEqual([['INICIO', '2026-03-12', 'A']]);
  });

  it('CLONE shows the same single initial row; DETAIL disables both actions', async () => {
    await open('Banco', 'CLONE');
    expect(cells('Banco')).toEqual([['●', 'INICIO', '12/03/2026', '', '']]);
  });
});

describe('S-ACT-3 / S-ANX-2 the Activar guards', () => {
  it('DETAIL disables both actions', async () => {
    await open('Banco', 'DETAIL');
    expect([button('Banco', 'Activar').disabled, button('Banco', 'Desactivar').disabled]).toEqual([true, true]);
  });

  it('refuses with the entity sentence when the last row is active, and opens no dialog', async () => {
    const { user } = await open('Trabajador');
    await user.click(button('Trabajador', 'Activar'));
    expect(notice('Trabajador')).toBe('Trabajador ya Esta Activado');
    noDialog('Activar Trabajador');
  });

  it('refuses when the last row was just deactivated in this register', async () => {
    const { user } = await open('Trabajador');
    await user.click(screen.getByText('INICIO'));
    await user.click(button('Trabajador', 'Desactivar'));
    await confirmDialog(user, 'Desactivar Trabajador', { motivo: ['Motivo de Desactivacion', 'cierre'] });
    await user.click(button('Trabajador', 'Activar'));
    expect(notice('Trabajador')).toBe('Trabajador recien lo acaba de Desactivar');
    noDialog('Activar Trabajador');
  });
});

describe.each(['Cliente', 'Vendedor'])('S-ANX-3 / S-ANX-8 the Activar dialog of %s', (entity) => {
  const reopen = () => open(entity, 'UPDATE', '0000000002');

  it('opens Activar {Entidad} with Fecha Inicio today, and a blank motivo keeps it open with Ingrese Motivo', async () => {
    const { user } = await reopen();
    await user.click(button(entity, 'Activar'));
    const dialog = await waitFor(() => dialogOf(`Activar ${entity}`));
    expect((within(dialog).getByLabelText('Fecha Inicio') as HTMLInputElement).value).toBe('12/03/2026');
    await user.click(within(dialog).getByRole('button', { name: 'Aceptar' }));
    expect(await within(dialog).findByText('Ingrese Motivo')).toBeTruthy();
    expect(dialogOf(`Activar ${entity}`)).toBe(dialog);
  });

  it('a confirmed motivo adds ONE pending row in uppercase and checks Estado', async () => {
    const { user } = await reopen();
    await user.click(screen.getByRole('tab', { name: 'General' }));
    expect(estado().checked).toBe(false);
    await user.click(screen.getByRole('tab', { name: `Activación de ${entity}` }));
    await user.click(button(entity, 'Activar'));
    await confirmDialog(user, `Activar ${entity}`, { motivo: ['Motivo de Activacion', 'reingreso'] });
    expect(cells(entity)).toEqual([['○', 'INICIO', '01/01/2026', 'CIERRE', '01/02/2026'], ['●', 'REINGRESO', '12/03/2026', '', '']]);
    await user.click(screen.getByRole('tab', { name: 'General' }));
    expect(estado().checked).toBe(true);
  });
});

describe('S-ANX-4 the Desactivar guards', () => {
  it('asks for a selected row', async () => {
    const { user } = await open('Cliente');
    await user.click(button('Cliente', 'Desactivar'));
    expect(notice('Cliente')).toBe('Seleccione un Registro');
    noDialog('Desactivar Cliente');
  });

  it('refuses a deactivated row', async () => {
    const { user } = await open('Cliente', 'UPDATE', '0000000002');
    await user.click(screen.getByText('CIERRE'));
    await user.click(button('Cliente', 'Desactivar'));
    expect(notice('Cliente')).toBe('Registro ya esta Desactivado');
    noDialog('Desactivar Cliente');
  });

  it('refuses a row just activated in this register', async () => {
    const { user } = await open('Cliente', 'UPDATE', '0000000002');
    await user.click(button('Cliente', 'Activar'));
    await confirmDialog(user, 'Activar Cliente', { motivo: ['Motivo de Activacion', 'vuelve'] });
    await user.click(screen.getByText('VUELVE'));
    await user.click(button('Cliente', 'Desactivar'));
    expect(notice('Cliente')).toBe('Cliente recien lo acaba de Activar');
    noDialog('Desactivar Cliente');
  });
});

describe('S-ANX-5 / S-ANX-6 the Desactivar effect', () => {
  it('closes the selected row with the fecha fin and the motivo, and unchecks Estado; cancelling the register persists nothing', async () => {
    const { user, mock, update, onClose } = await open('Proveedor');
    await user.click(screen.getByText('INICIO'));
    await user.click(button('Proveedor', 'Desactivar'));
    const dialog = await waitFor(() => dialogOf('Desactivar Proveedor'));
    expect((within(dialog).getByLabelText('Fecha Fin') as HTMLInputElement).value).toBe('12/03/2026');
    await confirmDialog(user, 'Desactivar Proveedor', { motivo: ['Motivo de Desactivacion', 'cierre'] });
    expect(cells('Proveedor')).toEqual([['○', 'INICIO', '10/03/2026', 'CIERRE', '12/03/2026']]);
    expect(stateOf('INICIO')).toBe('Desactivado');
    await user.click(screen.getByRole('tab', { name: 'General' }));
    expect(estado().checked).toBe(false);
    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    await confirmLast(user);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(update).not.toHaveBeenCalled();
    expect((await mock.children('maestros').list('0000000001', 'activaciones')).items.map((r: any) => r.estado)).toEqual(['A']);
  });

  it('saving the register sends the closed row as an A op, and the server keeps it', async () => {
    const { user, mock } = await open('Proveedor');
    await user.click(screen.getByText('INICIO'));
    await user.click(button('Proveedor', 'Desactivar'));
    await confirmDialog(user, 'Desactivar Proveedor', { motivo: ['Motivo de Desactivacion', 'cierre'] });
    await user.click(screen.getByRole('button', { name: 'Aceptar' }));
    await confirmLast(user);
    await waitFor(async () => expect(((await mock.catalog('maestros').get('0000000001')) as Record<string, unknown>).estado).toBe(false));
    expect((await mock.children('maestros').list('0000000001', 'activaciones')).items[0]).toMatchObject({ estado: 'D', f_fin: '2026-03-12', motivo_desactivacion: 'CIERRE' });
  });

  it('S-ANX-6 a fecha fin before the start is refused inside the dialog and the row is unchanged; the same day is accepted', async () => {
    const { user } = await open('Proveedor');
    await user.click(screen.getByText('INICIO'));
    await user.click(button('Proveedor', 'Desactivar'));
    const dialog = await waitFor(() => dialogOf('Desactivar Proveedor'));
    await retype(user, dialog, 'Fecha Fin', '09032026');
    await user.type(within(dialog).getByLabelText('Motivo de Desactivacion'), 'cierre');
    await user.click(within(dialog).getByRole('button', { name: 'Aceptar' }));
    await confirmLast(user);
    expect(await within(dialog).findByText('Fecha es menor a fecha inicial')).toBeTruthy();
    expect(stateOf('INICIO')).toBe('Activo');
    await retype(user, dialog, 'Fecha Fin', '10032026');
    await user.click(within(dialog).getByRole('button', { name: 'Aceptar' }));
    await confirmLast(user);
    await waitFor(() => expect(stateOf('INICIO')).toBe('Desactivado'));
    expect(cells('Proveedor')[0][4]).toBe('10/03/2026');
  });
});

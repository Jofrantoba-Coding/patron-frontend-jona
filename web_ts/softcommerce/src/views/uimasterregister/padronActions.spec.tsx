import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { parentEntry } from '../../../mock-server/core/children.fixture';
import { tinySeed } from '../../../mock-server/core/test-helpers';
import { padrones } from '../../../mock-server/registry/catalogs/padrones.js';
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
 * S-ANX-9..12 end to end: the real padron preset (grid, deferred Activar and Desactivar, the `padron` rule, the derived flags) over the in-browser mock, in a test
 * master `maestros` that is a Proveedor or a Cliente. The system date is 2026-03-12.
 */
const catalog = [
  { id_padron: '01', descripcion: 'EXCEPTUADO', para_cliente: true, para_proveedor: false, activo: true },
  { id_padron: '02', descripcion: 'AG. RETENCION', para_cliente: true, para_proveedor: true, activo: true },
  { id_padron: '03', descripcion: 'AG. PERCEPCION', para_cliente: true, para_proveedor: true, activo: true },
  { id_padron: '04', descripcion: 'BUEN CONTRIBUYENTE', para_cliente: false, para_proveedor: true, activo: true },
];
const seed = {
  ...tinySeed(),
  padrones: catalog,
  maestros: {
    a: [
      { id_maestros: '1', nombre: 'UNO', activo: true, flag_retencion: true, flag_percepcion: false, flag_buen_contrib: false, flag_exceptuado: false, padrones: [{ id: '1', id_padron: '02', estado: 'A', f_inicio: '2026-01-05', f_fin: '' }] },
      { id_maestros: '2', nombre: 'DOS', activo: true, flag_retencion: false, flag_percepcion: false, flag_buen_contrib: false, flag_exceptuado: false, padrones: [{ id: '1', id_padron: '03', estado: 'D', f_inicio: '2026-01-05', f_fin: '2026-02-01' }] },
    ],
  },
};
type Master = 'proveedor' | 'cliente';
const registryOf = (master: Master) => {
  const padron = presets.padron({ master });
  return validateRegistry([
    padrones,
    parentEntry('maestros', {
      entity: `un ${master}`, codeWidth: 1,
      fields: [{ name: 'id_maestros', kind: 'code', label: 'Codigo' }, { name: 'nombre', kind: 'text', label: 'Nombre', required: true, max: 30 }, ...padron.fields],
      children: padron.children, rules: padron.rules,
    }),
  ]);
};

const granted = Object.fromEntries(PERMISSION_FLAGS.map((f) => [f, true])) as Permissions;
type Mode = 'INSERT' | 'UPDATE';
type User = ReturnType<typeof userEvent.setup>;

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date(2026, 2, 12, 12, 0));
});
afterEach(() => vi.useRealTimers());

async function open(master: Master, mode: Mode = 'UPDATE', id = '1') {
  const registry = registryOf(master);
  const mock = createAppServicesMock('exitoso', { getSession: () => ({ tenantId: 'a' }), getRequestContext: () => ({ userId: '1' }), delayMs: 0, registry, seed });
  const config = toCatalogConfig(registry.bySlug.get('maestros'), registry);
  const service = mock.catalog('maestros');
  const update = vi.spyOn(service, 'update');
  render(
    <ServicesProvider services={mock as unknown as AppServices}>
      <DialogStackProvider>
        <UiMasterRegister config={config as any} service={service as any} mode={mode} id={mode === 'INSERT' ? undefined : id} permissions={granted} lookup={mock.lookup as any} onDone={vi.fn()} onClose={vi.fn()} />
      </DialogStackProvider>
    </ServicesProvider>,
  );
  await waitFor(() => expect(screen.queryByText('Cargando...')).toBeNull());
  const user = userEvent.setup();
  await user.click(screen.getByRole('tab', { name: 'Padrones' }));
  return { user, mock, update };
}
const panel = () => screen.getByRole('tabpanel', { name: 'Padrones' });
const button = (name: string) => within(panel()).getByRole('button', { name }) as HTMLButtonElement;
const notice = () => within(panel()).getByRole('status').textContent;
const cells = () => within(panel()).getAllByRole('row').slice(1).map((tr) => within(tr).getAllByRole('cell').map((td) => td.textContent));
const dialog = () => screen.getByText('Nuevo: Agregar Padron').closest<HTMLElement>('[role="dialog"]') as HTMLElement;
const confirmLast = async (user: User) => user.click((await screen.findAllByRole('button', { name: 'Confirmar' })).at(-1) as HTMLElement);
const flag = (label: string) => (screen.getByLabelText(label) as HTMLInputElement).checked;
const flags = async (user: User) => {
  await user.click(screen.getByRole('tab', { name: 'General' }));
  const out = [flag('A Retencion'), flag('A Percepcion')];
  await user.click(screen.getByRole('tab', { name: 'Padrones' }));
  return out;
};
async function activate(user: User, id: string) {
  await user.click(button('Activar'));
  const form = await waitFor(() => dialog());
  await waitFor(() => expect(within(form).getByLabelText('Padron').querySelectorAll('option').length).toBeGreaterThan(1));
  await user.selectOptions(within(form).getByLabelText('Padron'), id);
  await user.click(within(form).getByRole('button', { name: 'Aceptar' }));
  await confirmLast(user);
  return form;
}

describe('R-ANX-7 the Padrones tab', () => {
  it('shows the grid with the desktop columns and only Activar and Desactivar (no Agregar, no Quitar)', async () => {
    await open('proveedor');
    expect(within(panel()).getAllByRole('button').map((b) => b.textContent)).toEqual(['Activar', 'Desactivar']);
    expect(within(panel()).getAllByRole('columnheader').map((c) => c.textContent)).toEqual(['Estado', 'PADRON', 'F_INICIO', 'F_FIN']);
    expect(cells()).toEqual([['●', 'AG. RETENCION', '05/01/2026', '']]);
  });

  it('both buttons are enabled in INSERT too (the desktop only disables the activation ones)', async () => {
    await open('proveedor', 'INSERT');
    expect([button('Activar').disabled, button('Desactivar').disabled]).toEqual([false, false]);
    expect(cells()).toEqual([]);
  });
});

describe('S-ANX-10 the offer by master', () => {
  it.each([
    ['proveedor', ['AG. RETENCION', 'AG. PERCEPCION', 'BUEN CONTRIBUYENTE']],
    ['cliente', ['EXCEPTUADO', 'AG. RETENCION', 'AG. PERCEPCION']],
  ] as const)('the %s select offers %j', async (master, offered) => {
    const { user } = await open(master, 'UPDATE', '2');
    await user.click(button('Activar'));
    const form = await waitFor(() => dialog());
    await waitFor(() => expect(within(form).getByLabelText('Padron').querySelectorAll('option').length).toBeGreaterThan(1));
    const options = within(within(form).getByLabelText('Padron')).getAllByRole('option').map((o) => o.textContent);
    expect(options.filter((text) => offered.includes(text as never))).toEqual(offered);
    expect(options).toHaveLength(offered.length + 1);
    expect((within(form).getByLabelText('Fecha Inicio') as HTMLInputElement).value).toBe('12/03/2026');
  });
});

describe('S-ANX-9 the Activar guard', () => {
  it('Padron ya se Encuentra Activado keeps the dialog open', async () => {
    const { user } = await open('proveedor');
    const form = await activate(user, '02');
    expect(await within(form).findByText('Padron ya se Encuentra Activado')).toBeTruthy();
    expect(cells()).toHaveLength(1);
  });

  it('no padron says Seleccione Padron and nothing is added', async () => {
    const { user } = await open('proveedor', 'UPDATE', '2');
    await user.click(button('Activar'));
    const form = await waitFor(() => dialog());
    await user.click(within(form).getByRole('button', { name: 'Aceptar' }));
    expect(await within(form).findByText('Seleccione Padron')).toBeTruthy();
    expect(cells()).toHaveLength(1);
  });

  it('Cliente: 01 over an active 02 gives the percepcion sentence', async () => {
    const { user } = await open('cliente');
    const form = await activate(user, '01');
    expect(await within(form).findByText('Configuracion incompatible, Desactive AG. Percepcion y/o AG. Retencion')).toBeTruthy();
  });
});

describe('S-ANX-12 the flags follow the activation by padron id', () => {
  it('04 checks Buen Contribuyente and not A Percepcion; the flags are read-only', async () => {
    const { user } = await open('proveedor', 'UPDATE', '2');
    await activate(user, '04');
    await waitFor(() => expect(cells().at(-1)).toEqual(['●', 'BUEN CONTRIBUYENTE', '12/03/2026', '']));
    await user.click(screen.getByRole('tab', { name: 'General' }));
    expect([flag('Buen Contribuyente'), flag('A Percepcion'), flag('A Retencion')]).toEqual([true, false, false]);
    expect((screen.getByLabelText('Buen Contribuyente') as HTMLInputElement).disabled).toBe(true);
  });

  it('S-ANX-11 deactivating a pending row removes it and unchecks the flag; nothing is sent for it', async () => {
    const { user, update } = await open('proveedor', 'UPDATE', '2');
    await activate(user, '03');
    await waitFor(() => expect(cells()).toHaveLength(2));
    await user.click(screen.getAllByText('AG. PERCEPCION', { selector: 'td' }).at(-1) as HTMLElement);
    await user.click(button('Desactivar'));
    await confirmLast(user);
    await waitFor(() => expect(cells()).toHaveLength(1));
    expect(await flags(user)).toEqual([false, false]);
    await user.click(screen.getByRole('button', { name: 'Aceptar' }));
    await confirmLast(user);
    await waitFor(() => expect(update).toHaveBeenCalled());
    expect(JSON.stringify((update.mock.calls[0] as any)[1])).not.toContain('"op"');
  });
});

describe('S-ANX-11 Desactivar', () => {
  it('Seleccionar Fila without a selection, and the deactivated row is refused', async () => {
    const { user } = await open('proveedor', 'UPDATE', '2');
    await user.click(button('Desactivar'));
    expect(notice()).toBe('Seleccionar Fila');
    await user.click(screen.getByText('AG. PERCEPCION', { selector: 'td' }));
    await user.click(button('Desactivar'));
    expect(notice()).toBe('Padron Seleccionado ya esta desactivado');
  });

  it('asks Desea Desactivar Padron?, closes the row with fecha fin today and unchecks the flag; the server keeps it on save', async () => {
    const { user, mock } = await open('proveedor');
    await user.click(screen.getByText('AG. RETENCION', { selector: 'td' }));
    await user.click(button('Desactivar'));
    expect(await screen.findByText('Desea Desactivar Padron?')).toBeTruthy();
    await confirmLast(user);
    await waitFor(() => expect(cells()).toEqual([['○', 'AG. RETENCION', '05/01/2026', '12/03/2026']]));
    expect(await flags(user)).toEqual([false, false]);
    await user.click(screen.getByRole('button', { name: 'Aceptar' }));
    await confirmLast(user);
    await waitFor(async () => expect(((await mock.catalog('maestros').get('1')) as Record<string, unknown>).flag_retencion).toBe(false));
    expect((await mock.children('maestros').list('1', 'padrones')).items[0]).toMatchObject({ estado: 'D', f_fin: '2026-03-12' });
  });

  it('declining the question changes nothing', async () => {
    const { user } = await open('proveedor');
    await user.click(screen.getByText('AG. RETENCION', { selector: 'td' }));
    await user.click(button('Desactivar'));
    await user.click(await screen.findByRole('button', { name: 'Cancelar' }));
    expect(cells()[0][0]).toBe('●');
  });
});

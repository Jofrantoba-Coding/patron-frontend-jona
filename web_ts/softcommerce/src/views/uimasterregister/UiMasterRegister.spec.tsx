import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { validateRegistry } from '../../../mock-server/registry/schema.js';
import { toCatalogConfig } from '../../catalogs/registry';
import type { CatalogConfig } from '../../catalogs/CatalogConfig';
import type { InterCatalogService } from '../../services/InterCatalogService';
import { DialogStackProvider } from '../uishell/DialogStackProvider';
import { UiMasterRegister } from './UiMasterRegister';

type Row = Record<string, string>;
const text = (name: string, extra: Record<string, any> = {}) => ({ name, kind: 'text', label: name[0].toUpperCase() + name.slice(1), max: 20, normalize: ['upper'], ...extra });
const registry = validateRegistry([
  {
    slug: 'cliente', idKey: 'id_cliente', codeWidth: 0, entity: 'un Cliente', scope: 'tenant', seed: 'cliente', messages: { style: 'M1' },
    fields: [text('nombre', { required: true }), text('nacionalidad', { required: true }), text('dias', { required: true })],
    columns: [{ key: 'nombre', header: 'Nombre' }],
    children: {
      direcciones: {
        tab: 'Direcciones', removal: 'deactivate', fields: [text('calle', { required: true })], columns: [{ key: 'calle', header: 'Calle' }],
        unique: [{ fields: ['calle'], errorField: 'calle', message: 'Direccion ya Esta Agregada' }],
      },
      contactos: { tab: 'Contactos', fields: [text('persona', { required: true })], columns: [{ key: 'persona', header: 'Persona' }] },
    },
  },
]);
const base = toCatalogConfig(registry.bySlug.get('cliente'), registry) as CatalogConfig<Row>;
// `dias` sits on its own field tab: the field -> tab map comes from the layout.
const config: CatalogConfig<Row> = { ...base, layout: [{ title: 'Cobranza', fields: ['dias'] }] };

async function open(mode: 'INSERT' | 'DETAIL' = 'INSERT') {
  const service = {
    get: vi.fn(async () => ({ id_cliente: '7', nombre: 'ANA', nacionalidad: 'PERUANA', dias: '30' })),
    create: vi.fn(async (v: object) => ({ id_cliente: '9', ...v })), update: vi.fn(), remove: vi.fn(),
  } as unknown as InterCatalogService<Row>;
  const onClose = vi.fn();
  render(
    <DialogStackProvider>
      <UiMasterRegister config={config} service={service} mode={mode} id={mode === 'INSERT' ? undefined : '7'} onDone={vi.fn()} onClose={onClose} />
    </DialogStackProvider>,
  );
  await waitFor(() => expect(screen.queryByText('Cargando...')).toBeNull());
  return { user: userEvent.setup(), service, onClose };
}
type User = ReturnType<typeof userEvent.setup>;
const tab = (name: string) => screen.getByRole('tab', { name });
const panel = (name: string) => screen.getByRole('tabpanel', { name, hidden: true });
// Every JDialog labels itself with the same id, so the child dialog is found through its own title.
const childDialog = () => screen.queryByText('Nuevo: Direcciones')?.closest<HTMLElement>('[role="dialog"]') ?? null;
const fill = (user: User, label: string, value: string) => user.type(screen.getByLabelText(label), value);
const confirm = async () => fireConfirm(await screen.findAllByRole('button', { name: 'Confirmar' }));
const fireConfirm = (buttons: HTMLElement[]) => userEvent.click(buttons[buttons.length - 1]);
async function openChild(user: User) {
  await user.click(within(panel('Direcciones')).getByRole('button', { name: 'Agregar' }));
  return waitFor(() => childDialog() ?? Promise.reject(new Error('no child dialog')));
}
async function addDireccion(user: User, calle: string) {
  const dialog = await openChild(user);
  await user.type(within(dialog).getByLabelText('Calle'), calle);
  await user.click(within(dialog).getByRole('button', { name: 'Aceptar' }));
  await confirm();
}

describe('UiMasterRegister tabs (R-MD-1)', () => {
  it('renders General, the layout tab and one tab per child, with every panel mounted and only the active one visible', async () => {
    await open();
    expect(screen.getAllByRole('tab').map((t) => t.textContent)).toEqual(['General', 'Cobranza', 'Direcciones', 'Contactos']);
    const panels = screen.getAllByRole('tabpanel', { hidden: true });
    expect(panels).toHaveLength(4);
    expect(panels.map((p) => p.hidden)).toEqual([false, true, true, true]);
  });

  it('S-MD-2: a pending direccion and the entered General data survive Direcciones -> General -> Direcciones', async () => {
    const { user } = await open();
    await fill(user, 'Nombre', 'ana');
    await user.click(tab('Direcciones'));
    await addDireccion(user, 'av lima 1');
    await user.click(tab('General'));
    expect((screen.getByLabelText('Nombre') as HTMLInputElement).value).toBe('ANA');
    await user.click(tab('Direcciones'));
    expect(within(panel('Direcciones')).getAllByText('AV LIMA 1')).toHaveLength(1);
    expect(panel('Direcciones').hidden).toBe(false);
  });

  it('S-MD-1: a blank Nacionalidad submitted from Direcciones switches to General, shows the error and focuses the field', async () => {
    const { user, service } = await open();
    await fill(user, 'Nombre', 'ana');
    await user.click(tab('Direcciones'));
    await user.click(screen.getByRole('button', { name: 'Aceptar' }));
    expect(tab('General').getAttribute('aria-selected')).toBe('true');
    expect(panel('General').hidden).toBe(false);
    expect(within(panel('General')).getByRole('alert').textContent).toMatch(/Nacionalidad/);
    expect(document.activeElement).toBe(screen.getByLabelText('Nacionalidad'));
    expect(service.create).not.toHaveBeenCalled();
  });

  it('switches to the layout tab that owns the first failing field', async () => {
    const { user } = await open();
    await fill(user, 'Nombre', 'ana');
    await fill(user, 'Nacionalidad', 'peruana');
    await user.click(screen.getByRole('button', { name: 'Aceptar' }));
    expect(tab('Cobranza').getAttribute('aria-selected')).toBe('true');
    expect(document.activeElement).toBe(screen.getByLabelText('Dias'));
  });
});

describe('UiMasterRegister child dialog (S-MD-4, S-MD-5)', () => {
  it('S-MD-4: a valid confirm adds one pending row, closes the child dialog and sends no request; cancelling the parent discards it', async () => {
    const { user, service, onClose } = await open();
    await user.click(tab('Direcciones'));
    await addDireccion(user, 'av lima 1');
    expect(childDialog()).toBeNull();
    expect(within(panel('Direcciones')).getAllByText('AV LIMA 1')).toHaveLength(1);
    expect(service.create).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    await confirm();
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(service.create).not.toHaveBeenCalled();
  });

  it('S-MD-5: an invalid child confirm keeps the child dialog open with its field error and leaves the parent as it was', async () => {
    const { user } = await open();
    await fill(user, 'Nombre', 'ana');
    await user.click(tab('Direcciones'));
    const dialog = await openChild(user);
    await user.click(within(dialog).getByRole('button', { name: 'Aceptar' }));
    expect(within(dialog).getByRole('alert').textContent).toMatch(/Calle/);
    expect(childDialog()).not.toBeNull();
    expect(within(panel('Direcciones')).queryAllByRole('row')).toHaveLength(1);
    expect((screen.getByLabelText('Nombre') as HTMLInputElement).value).toBe('ANA');
  });

  it('refuses a calle already among the active siblings with the literal message and adds nothing (R-MD-6)', async () => {
    const { user } = await open();
    await user.click(tab('Direcciones'));
    await addDireccion(user, 'av lima 1');
    const dialog = await openChild(user);
    await user.type(within(dialog).getByLabelText('Calle'), 'av lima 1');
    await user.click(within(dialog).getByRole('button', { name: 'Aceptar' }));
    await confirm();
    expect(await within(dialog).findByText('Direccion ya Esta Agregada')).toBeTruthy();
    expect(within(panel('Direcciones')).getAllByText('AV LIMA 1')).toHaveLength(1);
  });
});

describe('UiMasterRegister seam (S-MD-13, S-MD-11)', () => {
  it('S-MD-13: only a pending child row changed, Esc shows the discard confirmation (R-CRUD-8)', async () => {
    const { user, onClose } = await open();
    await user.click(tab('Direcciones'));
    await addDireccion(user, 'av lima 1');
    await user.keyboard('{Escape}');
    expect(await screen.findByText('Descartar cambios')).toBeTruthy();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('a clean form closes on Esc without asking', async () => {
    const { user, onClose } = await open();
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('sends the pending rows with the parent in one create call', async () => {
    const { user, service } = await open();
    await fill(user, 'Nombre', 'ana');
    await fill(user, 'Nacionalidad', 'peruana');
    await user.click(tab('Direcciones'));
    await addDireccion(user, 'av lima 1');
    await user.click(tab('Cobranza'));
    await fill(user, 'Dias', '30');
    await user.click(screen.getByRole('button', { name: 'Aceptar' }));
    await confirm();
    expect(service.create).toHaveBeenCalledWith({ nombre: 'ANA', nacionalidad: 'PERUANA', dias: '30', children: { direcciones: [{ op: 'I', calle: 'AV LIMA 1' }] } });
  });

  it('S-MD-11: in DETAIL the child toolbars are disabled and no Agregar opens', async () => {
    const { user } = await open('DETAIL');
    await user.click(tab('Direcciones'));
    const add = within(panel('Direcciones')).getByRole('button', { name: 'Agregar' }) as HTMLButtonElement;
    expect(add.disabled).toBe(true);
    await user.click(add);
    expect(childDialog()).toBeNull();
    await user.click(tab('Contactos'));
    expect((within(panel('Contactos')).getByRole('button', { name: 'Agregar' }) as HTMLButtonElement).disabled).toBe(true);
  });
});

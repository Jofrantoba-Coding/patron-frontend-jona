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
const text = (name: string) => ({ name, kind: 'text', label: name[0].toUpperCase() + name.slice(1), max: 20, normalize: ['upper'], required: true });
const kid = (tab: string, field: string, over: Record<string, any> = {}) => ({ tab, fields: [text(field)], columns: [{ key: field, header: field }], ...over });
const registry = validateRegistry([
  {
    slug: 'cliente', idKey: 'id_cliente', codeWidth: 0, entity: 'un Cliente', scope: 'tenant', seed: 'cliente', messages: { style: 'M1' },
    fields: [text('nombre')], columns: [{ key: 'nombre', header: 'Nombre' }],
    children: {
      direcciones: kid('Direcciones', 'calle', { removal: 'deactivate', quitar: { none: 'Seleccione Fila.', confirm: 'Desea Quitar Direccion?', already: 'Direccion ya Esta desactivada' } }),
      contactos: kid('Contactos', 'persona', { removal: 'delete' }),
      activaciones: kid('Activaciones', 'motivo', { removal: 'none' }),
    },
  },
]);
const config = toCatalogConfig(registry.bySlug.get('cliente'), registry) as CatalogConfig<Row>;

async function open(mode: 'INSERT' | 'DETAIL' = 'INSERT') {
  const service = { get: vi.fn(async () => ({ id_cliente: '7', nombre: 'ANA' })), create: vi.fn(async (v: object) => ({ id_cliente: '9', ...v })), update: vi.fn(), remove: vi.fn() } as unknown as InterCatalogService<Row>;
  render(
    <DialogStackProvider>
      <UiMasterRegister config={config} service={service} mode={mode} id={mode === 'INSERT' ? undefined : '7'} onDone={vi.fn()} onClose={vi.fn()} />
    </DialogStackProvider>,
  );
  await waitFor(() => expect(screen.queryByText('Cargando...')).toBeNull());
  return { user: userEvent.setup(), service };
}
type User = ReturnType<typeof userEvent.setup>;
const panel = (name: string) => screen.getByRole('tabpanel', { name, hidden: true });
const childDialog = (title: string) => screen.getByText(`Nuevo: ${title}`).closest<HTMLElement>('[role="dialog"]') as HTMLElement;
async function add(user: User, tab: string, label: string, value: string) {
  await user.click(screen.getByRole('tab', { name: tab }));
  await user.click(within(panel(tab)).getByRole('button', { name: 'Agregar' }));
  const dialog = await waitFor(() => childDialog(tab));
  await user.type(within(dialog).getByLabelText(label), value);
  await user.click(within(dialog).getByRole('button', { name: 'Aceptar' }));
  await user.click((await screen.findAllByRole('button', { name: 'Confirmar' })).at(-1) as HTMLElement);
}

describe('UiMasterRegister quitar (R-MD-4, S-MD-6, S-MD-7)', () => {
  it('S-MD-6: a pending direccion asks the desktop question and disappears once confirmed, leaving no change behind', async () => {
    const { user, service } = await open();
    await add(user, 'Direcciones', 'Calle', 'av lima 1');
    await user.click(within(panel('Direcciones')).getByText('AV LIMA 1'));
    await user.click(within(panel('Direcciones')).getByRole('button', { name: 'Quitar' }));
    expect(await screen.findByText('Desea Quitar Direccion?')).toBeTruthy();
    await user.click((await screen.findAllByRole('button', { name: 'Confirmar' })).at(-1) as HTMLElement);
    await waitFor(() => expect(within(panel('Direcciones')).queryByText('AV LIMA 1')).toBeNull());
    await user.type(screen.getByLabelText('Nombre'), 'ana');
    await user.click(screen.getByRole('button', { name: 'Aceptar' }));
    await user.click((await screen.findAllByRole('button', { name: 'Confirmar' })).at(-1) as HTMLElement);
    expect(service.create).toHaveBeenCalledWith({ nombre: 'ANA' });
  });

  it('declining the question keeps the row', async () => {
    const { user } = await open();
    await add(user, 'Direcciones', 'Calle', 'av lima 1');
    await user.click(within(panel('Direcciones')).getByText('AV LIMA 1'));
    await user.click(within(panel('Direcciones')).getByRole('button', { name: 'Quitar' }));
    await user.click(await screen.findByRole('button', { name: 'No' }));
    expect(within(panel('Direcciones')).getAllByText('AV LIMA 1')).toHaveLength(1);
  });

  it('removes a child without a question when the desktop did not ask one', async () => {
    const { user } = await open();
    await add(user, 'Contactos', 'Persona', 'luis');
    await user.click(within(panel('Contactos')).getByText('LUIS'));
    await user.click(within(panel('Contactos')).getByRole('button', { name: 'Quitar' }));
    await waitFor(() => expect(within(panel('Contactos')).queryByText('LUIS')).toBeNull());
  });

  it('S-MD-7: with no selected row Quitar shows the grid message and changes nothing', async () => {
    const { user } = await open();
    await add(user, 'Contactos', 'Persona', 'luis');
    await user.click(within(panel('Contactos')).getByRole('button', { name: 'Quitar' }));
    expect(within(panel('Contactos')).getByRole('status').textContent).toBe('Seleccione Fila.');
    expect(within(panel('Contactos')).getAllByText('LUIS')).toHaveLength(1);
  });

  it('a child that cannot be removed has no Quitar, and in DETAIL Quitar is disabled', async () => {
    const { user } = await open('DETAIL');
    await user.click(screen.getByRole('tab', { name: 'Activaciones' }));
    expect(within(panel('Activaciones')).queryByRole('button', { name: 'Quitar' })).toBeNull();
    await user.click(screen.getByRole('tab', { name: 'Direcciones' }));
    expect((within(panel('Direcciones')).getByRole('button', { name: 'Quitar' }) as HTMLButtonElement).disabled).toBe(true);
  });
});

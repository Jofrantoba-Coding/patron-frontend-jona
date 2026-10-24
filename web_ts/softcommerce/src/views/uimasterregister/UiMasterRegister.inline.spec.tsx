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
const registry = validateRegistry([
  {
    slug: 'transportista', idKey: 'id_transportista', codeWidth: 0, entity: 'un Transportista', scope: 'tenant', seed: 'transportista', messages: { style: 'M1' },
    fields: [{ name: 'nombre', kind: 'text', label: 'Nombre', max: 20 }], columns: [{ key: 'nombre', header: 'Nombre' }],
    children: {
      vehiculos: {
        tab: 'Vehiculos', removal: 'delete', entry: 'inline',
        fields: [
          { name: 'placa', kind: 'text', label: 'Placa', max: 8, required: true, normalize: ['upper'], message: 'Ingrese Placa' },
          { name: 'peso', kind: 'number', label: 'Peso', scale: 2, max: 8, default: '0' },
        ],
        columns: [{ key: 'placa', header: 'Placa' }, { key: 'peso', header: 'Peso' }],
        unique: [{ fields: ['placa'], errorField: 'placa', message: 'Placa ya Esta Agregada' }],
      },
    },
  },
]);
const config = toCatalogConfig(registry.bySlug.get('transportista'), registry) as CatalogConfig<Row>;

async function open(mode: 'INSERT' | 'DETAIL' = 'INSERT') {
  const service = { get: vi.fn(async () => ({ id_transportista: '7', nombre: 'TRA' })), create: vi.fn(async (v: object) => ({ id_transportista: '9', ...v })), update: vi.fn(), remove: vi.fn() } as unknown as InterCatalogService<Row>;
  const onClose = vi.fn();
  render(
    <DialogStackProvider>
      <UiMasterRegister config={config} service={service} mode={mode} id={mode === 'INSERT' ? undefined : '7'} onDone={vi.fn()} onClose={onClose} />
    </DialogStackProvider>,
  );
  await waitFor(() => expect(screen.queryByText('Cargando...')).toBeNull());
  const user = userEvent.setup();
  await user.click(screen.getByRole('tab', { name: 'Vehiculos' }));
  return { user, service, onClose, panel: screen.getByRole('tabpanel', { name: 'Vehiculos' }) };
}
const agregar = (panel: HTMLElement) => within(panel).getByRole('button', { name: 'Agregar' });

describe('UiMasterRegister inline entry (R-MD-3, D10)', () => {
  it('renders the child fields above the grid, with the entry button and no child dialog', async () => {
    const { panel } = await open();
    const placa = within(panel).getByLabelText('Placa');
    const grid = within(panel).getByRole('table');
    expect(placa.compareDocumentPosition(grid) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect((within(panel).getByLabelText('Peso') as HTMLInputElement).value).toBe('0');
    expect(within(panel).getAllByRole('button', { name: 'Agregar' })).toHaveLength(1);
  });

  it('validates in place with the child message and adds nothing while a field fails', async () => {
    const { user, panel } = await open();
    await user.click(agregar(panel));
    expect(within(panel).getByRole('alert').textContent).toMatch(/Placa/);
    expect(within(panel).queryAllByRole('row')).toHaveLength(1);
  });

  it('a valid Agregar adds one pending row without a question and resets the entry (placa blank, peso back to 0)', async () => {
    const { user, panel, service } = await open();
    await user.type(within(panel).getByLabelText('Placa'), 'abc123');
    await user.clear(within(panel).getByLabelText('Peso'));
    await user.type(within(panel).getByLabelText('Peso'), '12.5');
    await user.click(agregar(panel));
    await waitFor(() => expect(within(panel).getAllByText('ABC123')).toHaveLength(1));
    expect((within(panel).getByLabelText('Placa') as HTMLInputElement).value).toBe('');
    expect((within(panel).getByLabelText('Peso') as HTMLInputElement).value).toBe('0');
    expect(service.create).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Aceptar' }));
    await user.click((await screen.findAllByRole('button', { name: 'Confirmar' })).at(-1) as HTMLElement);
    expect(service.create).toHaveBeenCalledWith({ nombre: '', children: { vehiculos: [{ op: 'I', placa: 'ABC123', peso: 12.5 }] } });
  });

  it('refuses a placa already among the active rows with the literal message', async () => {
    const { user, panel } = await open();
    for (const text of ['abc123', 'abc123']) {
      await user.type(within(panel).getByLabelText('Placa'), text);
      await user.click(agregar(panel));
    }
    expect(await within(panel).findByText('Placa ya Esta Agregada')).toBeTruthy();
    expect(within(panel).getAllByText('ABC123')).toHaveLength(1);
  });

  it('in DETAIL the toolbar is disabled and no entry shows', async () => {
    const { panel } = await open('DETAIL');
    expect(within(panel).queryByLabelText('Placa')).toBeNull();
    expect((agregar(panel) as HTMLButtonElement).disabled).toBe(true);
  });

  it('does not take Esc away from the register: a clean form still closes on Esc', async () => {
    const { user, onClose } = await open();
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

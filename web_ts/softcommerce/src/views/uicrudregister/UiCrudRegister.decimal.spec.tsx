import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { validateRegistry } from '../../../mock-server/registry/schema.js';
import { toCatalogConfig } from '../../catalogs/registry';
import type { InterCatalogService } from '../../services/InterCatalogService';
import { DialogStackProvider } from '../uishell/DialogStackProvider';
import type { RegisterMode } from './InterUiCrudRegister';
import { UiCrudRegister } from './UiCrudRegister';

const monto = (name: string, label: string, over: Record<string, unknown> = {}) => ({
  name, kind: 'number', label, scale: 2, required: true, exclusiveMin: 0, default: '0.0', blankToDefault: true,
  message: `Para {modo} un Cambio , debes especificar su ${label}.`, ...over,
});
const config = toCatalogConfig(
  validateRegistry([
    {
      slug: 'cambios', idKey: 'id_cambio', codeWidth: 0, entity: 'un Cambio', scope: 'tenant', seed: 'cambios', messages: { style: 'M1' },
      fields: [
        { name: 'id_cambio', kind: 'code', label: 'Código' },
        monto('compra', 'Compra'),
        monto('piso', 'Piso', { exclusiveMin: undefined, min: -10, required: false, blankToDefault: false }),
      ],
      columns: [{ key: 'compra', header: 'C', type: 'dec' }],
    },
  ]).entries[0],
);

async function open(mode: RegisterMode = 'INSERT') {
  const user = userEvent.setup();
  const service = {
    get: vi.fn(async () => ({ id_cambio: '1', compra: 3.4567, piso: 0 })),
    create: vi.fn(async (values: object) => ({ id_cambio: '2', ...values })),
    update: vi.fn(async () => ({})),
  };
  render(
    <DialogStackProvider>
      <UiCrudRegister config={config} service={service as unknown as InterCatalogService<Record<string, string>>} mode={mode} id={mode === 'INSERT' ? undefined : '1'} onDone={vi.fn()} onClose={vi.fn()} />
    </DialogStackProvider>,
  );
  await waitFor(() => expect(screen.queryByText('Cargando...')).toBeNull());
  return { user, service };
}
const field = (label: string) => screen.getByLabelText(label) as HTMLInputElement;
const submit = (user: ReturnType<typeof userEvent.setup>) => user.click(screen.getByRole('button', { name: 'Aceptar' }));

describe('decimal fields in the register (S-CRUD-25, S-CRUD-26)', () => {
  it('S-CRUD-26 INSERT starts at 0.0; clearing it and leaving shows 0.0 again', async () => {
    const { user } = await open();
    expect(field('Compra').value).toBe('0.0');
    await user.clear(field('Compra'));
    expect(field('Compra').value).toBe('');
    await user.tab();
    expect(field('Compra').value).toBe('0.0');
  });

  it('a field without blankToDefault stays blank on blur', async () => {
    const { user } = await open();
    await user.clear(field('Piso'));
    await user.tab();
    expect(field('Piso').value).toBe('');
  });

  it('S-CRUD-25 1.5.2 and letters are ignored; -3 is typed, then blocked on submit with the field text', async () => {
    const { user, service } = await open();
    await user.clear(field('Compra'));
    await user.type(field('Compra'), '1.5.2a');
    expect(field('Compra').value).toBe('1.52');
    await user.clear(field('Compra'));
    await user.type(field('Compra'), '-3');
    expect(field('Compra').value).toBe('-3');
    await submit(user);
    expect(screen.getByText('Para agregar un Cambio , debes especificar su Compra.')).toBeTruthy();
    expect(service.create).not.toHaveBeenCalled();
  });

  it('the untouched default 0.0 is not a positive amount: the submit is blocked', async () => {
    const { user, service } = await open();
    await submit(user);
    expect(screen.getByText('Para agregar un Cambio , debes especificar su Compra.')).toBeTruthy();
    expect(service.create).not.toHaveBeenCalled();
  });

  it('sends the decimals typed as numbers, with no rounding', async () => {
    const { user, service } = await open();
    await user.clear(field('Compra'));
    await user.type(field('Compra'), '3.4567');
    await submit(user);
    await user.click(screen.getByRole('button', { name: 'Confirmar' }));
    await waitFor(() => expect(service.create).toHaveBeenCalledWith({ compra: 3.4567, piso: 0 }));
  });

  it('UPDATE shows the stored number as it is, with no rounding', async () => {
    await open('UPDATE');
    expect(field('Compra').value).toBe('3.4567');
    expect(field('Piso').value).toBe('0');
  });

  it('a negative bounded below by min is accepted above the bound only', async () => {
    const { user, service } = await open();
    await user.clear(field('Compra'));
    await user.type(field('Compra'), '2');
    await user.clear(field('Piso'));
    await user.type(field('Piso'), '-11');
    await submit(user);
    expect(screen.getByText('Para agregar un Cambio , debes especificar su Piso.')).toBeTruthy();
    expect(service.create).not.toHaveBeenCalled();
  });
});

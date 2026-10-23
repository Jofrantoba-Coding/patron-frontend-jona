import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { createRecord } from '../../mock-server/core/catalog.js';
import { createStore } from '../../mock-server/core/store.js';
import { tinySeed } from '../../mock-server/core/test-helpers.js';
import { validateRegistry } from '../../mock-server/registry/schema.js';
import { ApiError } from '../services/ApiError';
import type { InterCatalogService } from '../services/InterCatalogService';
import { DialogStackProvider } from '../views/uishell/DialogStackProvider';
import { UiCrudRegister } from '../views/uicrudregister/UiCrudRegister';
import { toCatalogConfig } from './registry';

/**
 * S-REG-17 UI half and S-REF-15 last row, end to end on a test-only entry: the real client rules in front of the real core rules.
 * The declared order is tipo, serie, the unique key, then the ticket field: the client validates only up to the unique key
 * (the first server-only step), the server reports the ticket field after a passing unique.
 */
const registry = validateRegistry([
  {
    slug: 'tickets', idKey: 'id_tickets', codeWidth: 0, entity: 'un Ticket', scope: 'tenant', seed: 'tickets', messages: { style: 'M1' },
    fields: [
      { name: 'id_tickets', kind: 'code', label: 'Código' },
      { name: 'tipo', kind: 'options', label: 'Tipo', required: true, display: 'select', options: [{ value: '01', label: 'Factura' }, { value: 'TI', label: 'Ticket' }], default: '01' },
      { name: 'serie', kind: 'text', label: 'Serie', required: true, max: 4, msgLabel: 'su Serie' },
      { name: 'nota', kind: 'text', label: 'Nota', max: 10, msgLabel: 'su Nota', visibleWhen: { field: 'tipo', in: ['TI'] }, requiredWhen: { field: 'tipo', in: ['TI'] } },
    ],
    columns: [{ key: 'serie', header: 'Serie' }],
    unique: [{ fields: ['serie'], errorField: 'serie', message: 'La serie ya existe.' }],
    validation: ['tipo', 'serie', { unique: 0 }, 'nota'],
  },
]);
const config = toCatalogConfig(registry.bySlug.get('tickets'));

async function open() {
  const user = userEvent.setup();
  const store = createStore({ ...tinySeed(), tickets: { a: [{ id_tickets: '1', tipo: '01', serie: 'F001', nota: '', activo: true }] } }, registry);
  const create = vi.fn(async (body: Record<string, unknown>) => {
    try {
      return createRecord(store, 'a', 'tickets', body);
    } catch (error: any) {
      throw new ApiError(error.status, { code: error.code, message: error.message, details: error.details, traceId: 't-1' });
    }
  });
  render(
    <DialogStackProvider>
      <UiCrudRegister config={config} service={{ create } as unknown as InterCatalogService<Record<string, string>>} mode="INSERT" onDone={vi.fn()} onClose={vi.fn()} />
    </DialogStackProvider>,
  );
  await waitFor(() => expect(screen.queryByText('Cargando...')).toBeNull());
  await user.selectOptions(screen.getByLabelText('Tipo'), 'Ticket');
  return { user, create, store };
}
type User = ReturnType<typeof userEvent.setup>;
const send = async (user: User) => {
  await user.click(screen.getByRole('button', { name: 'Aceptar' }));
  if (screen.queryByRole('button', { name: 'Confirmar' })) await user.click(screen.getByRole('button', { name: 'Confirmar' }));
};

describe('S-REG-17 the client validates only up to the first server-only step', () => {
  it('a blank serie is caught by the client; nothing is sent and the later ticket field is not reported', async () => {
    const { user, create } = await open();
    await send(user);
    expect(screen.getByText('Para agregar un Ticket, debes especificar su Serie.')).toBeTruthy();
    expect(screen.queryByText('Para agregar un Ticket, debes especificar su Nota.')).toBeNull();
    expect(create).not.toHaveBeenCalled();
  });

  it('with the prefix valid and the ticket field blank the request goes out: that step belongs to the server', async () => {
    const { user, create } = await open();
    await user.type(screen.getByLabelText('Serie'), 'T001');
    await send(user);
    await waitFor(() => expect(create).toHaveBeenCalledTimes(1));
    expect(create).toHaveBeenCalledWith(expect.objectContaining({ tipo: 'TI', serie: 'T001', nota: '' }));
  });
});

describe('S-REF-15 the ticket field is reported by the server after a passing unique', () => {
  it('a duplicate serie is the error shown, on the serie, even though the ticket field is also blank', async () => {
    const { user } = await open();
    await user.type(screen.getByLabelText('Serie'), 'F001');
    await send(user);
    expect(await screen.findByText('La serie ya existe.')).toBeTruthy();
    expect(screen.queryByText('Para agregar un Ticket, debes especificar su Nota.')).toBeNull();
    await waitFor(() => expect(document.activeElement).toBe(screen.getByLabelText('Serie')));
  });

  it('once the serie is free the server names the ticket field, which is focused, and the values stay', async () => {
    const { user } = await open();
    await user.type(screen.getByLabelText('Serie'), 'T002');
    await send(user);
    expect(await screen.findByText('Para agregar un Ticket, debes especificar su Nota.')).toBeTruthy();
    await waitFor(() => expect(document.activeElement).toBe(screen.getByLabelText('Nota')));
    expect((screen.getByLabelText('Serie') as HTMLInputElement).value).toBe('T002');
  });

  it('typing the ticket field saves the record', async () => {
    const { user, store } = await open();
    await user.type(screen.getByLabelText('Serie'), 'T003');
    await user.type(screen.getByLabelText('Nota'), 'N-9');
    await send(user);
    await waitFor(() => expect(store.data('a').tickets.some((r: any) => r.serie === 'T003' && r.nota === 'N-9')).toBe(true));
  });
});

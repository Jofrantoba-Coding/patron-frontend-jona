import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { validateRegistry } from '../../../mock-server/registry/schema.js';
import { toCatalogConfig } from '../../catalogs/registry';
import { ApiError } from '../../services/ApiError';
import type { InterCatalogService } from '../../services/InterCatalogService';
import { DialogStackProvider } from '../uishell/DialogStackProvider';
import type { RegisterMode } from './InterUiCrudRegister';
import { UiCrudRegister } from './UiCrudRegister';

// Test-only entry (S-CRUD-28): `notFuture` and `afterField` are enabled by no Wave 2 catalog.
const config = toCatalogConfig(
  validateRegistry([
    {
      slug: 'agenda', idKey: 'id_agenda', codeWidth: 0, entity: 'una Cita', scope: 'tenant', seed: 'agenda', messages: { style: 'M1' },
      fields: [
        { name: 'id_agenda', kind: 'code', label: 'Código' },
        { name: 'fecha', kind: 'date', label: 'Fecha', required: true, default: { INSERT: 'today', CLONE: 'today' }, message: 'La fecha de la Cita no es válida.', messages: { date: 'La fecha de la Cita no es válida.' } },
        { name: 'limite', kind: 'date', label: 'Límite', notFuture: true, messages: { notFuture: 'El límite no puede ser futuro.' } },
        { name: 'fecha_ini', kind: 'date', label: 'Fecha Ini' },
        { name: 'fecha_fin', kind: 'date', label: 'Fecha Fin', afterField: 'fecha_ini', messages: { afterField: 'Fecha Fin no puede ser menor que Fecha Ini.' } },
      ],
      columns: [{ key: 'fecha', header: 'F', type: 'date' }],
    },
  ]).entries[0],
);

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date(2026, 5, 15, 12, 0));
});
afterEach(() => vi.useRealTimers());

async function open(mode: RegisterMode = 'INSERT', failWith?: ApiError) {
  const user = userEvent.setup();
  const service = {
    get: vi.fn(async () => ({ id_agenda: '1', fecha: '2026-01-15', limite: '', fecha_ini: '2026-02-01', fecha_fin: '2026-03-01' })),
    create: vi.fn(async (values: object) => {
      if (failWith) throw failWith;
      return { id_agenda: '2', ...values };
    }),
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
const retype = async (user: ReturnType<typeof userEvent.setup>, label: string, digits: string) => {
  await user.clear(field(label));
  await user.type(field(label), digits);
};

describe('date fields in the register (S-CRUD-27)', () => {
  it('INSERT starts today, masked dd/MM/yyyy', async () => {
    await open();
    expect(field('Fecha').value).toBe('15/06/2026');
  });

  it('31/02/2026 blocks the submit with the date message and focuses the field', async () => {
    const { user, service } = await open();
    await retype(user, 'Fecha', '31022026');
    expect(field('Fecha').value).toBe('31/02/2026');
    await submit(user);
    expect(screen.getByText('La fecha de la Cita no es válida.')).toBeTruthy();
    expect(document.activeElement).toBe(field('Fecha'));
    expect(service.create).not.toHaveBeenCalled();
  });

  it('15/01/2026 is sent as the ISO date 2026-01-15; an untouched optional date is sent empty', async () => {
    const { user, service } = await open();
    await retype(user, 'Fecha', '15012026');
    await submit(user);
    await user.click(screen.getByRole('button', { name: 'Confirmar' }));
    await waitFor(() => expect(service.create).toHaveBeenCalledWith({ fecha: '2026-01-15', limite: '', fecha_ini: '', fecha_fin: '' }));
  });

  it('UPDATE shows the stored ISO dates as dd/MM/yyyy', async () => {
    await open('UPDATE');
    expect([field('Fecha').value, field('Fecha Ini').value, field('Fecha Fin').value, field('Límite').value]).toEqual(['15/01/2026', '01/02/2026', '01/03/2026', '']);
  });

  it('CLONE sets the date to today: the per-mode default overrides the cloned value', async () => {
    await open('CLONE');
    expect(field('Fecha').value).toBe('15/06/2026');
    expect(field('Fecha Ini').value).toBe('01/02/2026');
  });

  it('a 409 on fecha shows under the date field (G6: the composite-unique error maps to its field)', async () => {
    const duplicate = new ApiError(409, { code: 'DUPLICATE', message: 'Duplicate record', details: [{ field: 'fecha', message: 'La fecha ya se encuentra registrada.' }], traceId: 't-1' });
    const { user } = await open('INSERT', duplicate);
    await submit(user);
    await user.click(screen.getByRole('button', { name: 'Confirmar' }));
    expect(await screen.findByText('La fecha ya se encuentra registrada.')).toBeTruthy();
    expect(field('Fecha').getAttribute('aria-invalid')).toBe('true');
  });
});

describe('S-CRUD-28 date range and not-future (test-only config)', () => {
  it('notFuture: tomorrow is blocked with the configured message, today is accepted', async () => {
    const { user, service } = await open();
    await retype(user, 'Límite', '16062026');
    await submit(user);
    expect(screen.getByText('El límite no puede ser futuro.')).toBeTruthy();
    expect(document.activeElement).toBe(field('Límite'));
    expect(service.create).not.toHaveBeenCalled();
    await retype(user, 'Límite', '15062026');
    await submit(user);
    expect(screen.queryByText('El límite no puede ser futuro.')).toBeNull();
    expect(screen.getByRole('button', { name: 'Confirmar' })).toBeTruthy();
  });

  it('afterField: fecha_fin before fecha_ini is blocked on fecha_fin; equal dates are accepted', async () => {
    const { user, service } = await open();
    await retype(user, 'Fecha Ini', '01022026');
    await retype(user, 'Fecha Fin', '01012026');
    await submit(user);
    expect(screen.getByText('Fecha Fin no puede ser menor que Fecha Ini.')).toBeTruthy();
    expect(document.activeElement).toBe(field('Fecha Fin'));
    expect(service.create).not.toHaveBeenCalled();
    await retype(user, 'Fecha Fin', '01022026');
    await submit(user);
    expect(screen.queryByText('Fecha Fin no puede ser menor que Fecha Ini.')).toBeNull();
    expect(screen.getByRole('button', { name: 'Confirmar' })).toBeTruthy();
  });
});

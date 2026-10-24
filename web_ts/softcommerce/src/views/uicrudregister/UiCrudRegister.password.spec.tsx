import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { validateRegistry } from '../../../mock-server/registry/schema.js';
import { toCatalogConfig } from '../../catalogs/registry';
import type { CatalogConfig } from '../../catalogs/CatalogConfig';
import { ApiError } from '../../services/ApiError';
import type { InterCatalogService } from '../../services/InterCatalogService';
import { DialogStackProvider } from '../uishell/DialogStackProvider';
import { UiCrudRegister } from './UiCrudRegister';

type Row = Record<string, string>;
const registry = validateRegistry([
  {
    slug: 'cuenta', idKey: 'id_cuenta', codeWidth: 0, entity: 'una cuenta', scope: 'tenant', seed: 'cuenta', messages: { style: 'M1' },
    fields: [
      { name: 'id_cuenta', kind: 'code', label: 'Codigo' },
      { name: 'usuario', kind: 'text', label: 'Usuario', max: 20 },
      { name: 'clave', kind: 'password', label: 'Contraseña', msgLabel: 'su clave', max: 20 },
    ],
    columns: [{ key: 'usuario', header: 'U' }],
  },
]);
const config = toCatalogConfig(registry.bySlug.get('cuenta'), registry) as CatalogConfig<Row>;
// The server never returns the password: the record has no `clave` key.
const RECORD: Row = { id_cuenta: '7', usuario: 'ana' };

async function open(mode: 'INSERT' | 'UPDATE' | 'DETAIL' | 'DELETE' | 'CLONE' = 'INSERT', create?: (v: object) => Promise<object>) {
  const user = userEvent.setup();
  const service = {
    get: vi.fn(async () => RECORD),
    create: vi.fn(create ?? (async (v: object) => ({ id_cuenta: '9', ...v }))),
    update: vi.fn(async (id: string, v: object) => ({ id, ...v })),
    remove: vi.fn(async () => undefined),
  } as unknown as InterCatalogService<Row>;
  render(
    <DialogStackProvider>
      <UiCrudRegister config={config} service={service} mode={mode} id={mode === 'INSERT' ? undefined : '7'} onDone={vi.fn()} onClose={vi.fn()} />
    </DialogStackProvider>,
  );
  await waitFor(() => expect(screen.queryByText('Cargando...')).toBeNull());
  return { user, service };
}
const clave = () => screen.getByLabelText('Contraseña') as HTMLInputElement;
const confirmacion = () => screen.getByLabelText('Confirmar Contraseña') as HTMLInputElement;
const submit = async (user: ReturnType<typeof userEvent.setup>) => user.click(screen.getByRole('button', { name: 'Aceptar' }));
const MISMATCH = 'La confirmación de la contraseña no coincide.';

describe('registry adapter for a password field (R-REG-13)', () => {
  it('becomes a password config that keeps its max and confirm', () => {
    expect(config.fields.find((f) => f.name === 'clave')).toMatchObject({ kind: 'password', label: 'Contraseña', maxLength: 20, confirm: true });
  });
});

describe('S-CRUD-43 password confirmation in the register', () => {
  it('abc / abd blocks the submit with no request; the confirmation shows the configured error and is focused', async () => {
    const { user, service } = await open();
    await user.type(clave(), 'abc');
    await user.type(confirmacion(), 'abd');
    await submit(user);
    expect(await screen.findByText(MISMATCH)).toBeTruthy();
    expect(document.activeElement).toBe(confirmacion());
    expect(screen.queryByRole('button', { name: 'Confirmar' })).toBeNull();
    expect(service.create).not.toHaveBeenCalled();
  });

  it('equal values send both strings', async () => {
    const { user, service } = await open();
    await user.type(screen.getByLabelText('Usuario'), 'ana');
    await user.type(clave(), 'abc');
    await user.type(confirmacion(), 'abc');
    await submit(user);
    await user.click(await screen.findByRole('button', { name: 'Confirmar' }));
    await waitFor(() => expect(service.create).toHaveBeenCalledWith({ usuario: 'ana', clave: 'abc', clave_confirmacion: 'abc' }));
  });

  it('a blank password on INSERT shows the desktop required sentence and focuses it', async () => {
    const { user, service } = await open();
    await submit(user);
    expect(await screen.findByText('Para agregar una cuenta, debes especificar su clave.')).toBeTruthy();
    expect(document.activeElement).toBe(clave());
    expect(service.create).not.toHaveBeenCalled();
  });

  it('a direct API mismatch (422 on clave_confirmacion) shows under the confirmation and focuses it', async () => {
    const failing = () => Promise.reject(new ApiError(422, { code: 'VALIDATION_ERROR', message: 'Validation failed', details: [{ field: 'clave_confirmacion', message: MISMATCH }], traceId: 't' }));
    const { user } = await open('INSERT', failing);
    await user.type(clave(), 'abc');
    await user.type(confirmacion(), 'abc');
    await submit(user);
    await user.click(await screen.findByRole('button', { name: 'Confirmar' }));
    expect(await screen.findByText(MISMATCH)).toBeTruthy();
    await waitFor(() => expect(document.activeElement).toBe(confirmacion()));
  });

  it('editing the password clears the error of the confirmation', async () => {
    const { user } = await open();
    await user.type(clave(), 'abc');
    await user.type(confirmacion(), 'abd');
    await submit(user);
    await screen.findByText(MISMATCH);
    await user.type(clave(), 'x');
    expect(screen.queryByText(MISMATCH)).toBeNull();
  });
});

describe('S-CRUD-44 password on UPDATE, DETAIL, DELETE and CLONE', () => {
  it('UPDATE shows both inputs empty and a blank pair sends neither key', async () => {
    const { user, service } = await open('UPDATE');
    expect([clave().value, confirmacion().value]).toEqual(['', '']);
    await user.type(screen.getByLabelText('Usuario'), 'x');
    await submit(user);
    await user.click(await screen.findByRole('button', { name: 'Confirmar' }));
    await waitFor(() => expect(service.update).toHaveBeenCalledWith('7', { usuario: 'anax' }));
  });

  it('UPDATE with a typed pair sends both keys; a half-typed pair is blocked', async () => {
    const { user, service } = await open('UPDATE');
    await user.type(clave(), 'nueva');
    await submit(user);
    expect(await screen.findByText(MISMATCH)).toBeTruthy();
    expect(service.update).not.toHaveBeenCalled();
    await user.type(confirmacion(), 'nueva');
    await submit(user);
    await user.click(await screen.findByRole('button', { name: 'Confirmar' }));
    await waitFor(() => expect(service.update).toHaveBeenCalledWith('7', { usuario: 'ana', clave: 'nueva', clave_confirmacion: 'nueva' }));
  });

  it.each(['DETAIL', 'DELETE'] as const)('%s does not render the field', async (mode) => {
    await open(mode);
    expect([screen.queryByLabelText('Contraseña'), screen.queryByLabelText('Confirmar Contraseña'), screen.queryByLabelText('Mostrar caracteres')]).toEqual([null, null, null]);
  });

  it('CLONE shows both inputs empty and the password is required again', async () => {
    const { user, service } = await open('CLONE');
    expect([clave().value, confirmacion().value]).toEqual(['', '']);
    await submit(user);
    expect(await screen.findByText('Para clonar una cuenta, debes especificar su clave.')).toBeTruthy();
    expect(service.create).not.toHaveBeenCalled();
  });
});

describe('S-CRUD-45 a password never leaks into the page', () => {
  it('a 422 on the password shows the server message and details, and the page text never holds the typed value', async () => {
    const failing = () => Promise.reject(new ApiError(422, { code: 'VALIDATION_ERROR', message: 'Validation failed', details: [{ field: 'clave', message: 'clave must be at most 20 characters' }], traceId: 't' }));
    const { user } = await open('INSERT', failing);
    await user.type(clave(), 'secreto-123');
    await user.type(confirmacion(), 'secreto-123');
    await submit(user);
    await user.click(await screen.findByRole('button', { name: 'Confirmar' }));
    expect(await screen.findByText('clave must be at most 20 characters')).toBeTruthy();
    expect(document.body.textContent).not.toContain('secreto-123');
  });
});

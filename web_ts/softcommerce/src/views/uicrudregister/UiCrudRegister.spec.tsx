import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { CatalogConfig } from '../../catalogs/CatalogConfig';
import { ApiError } from '../../services/ApiError';
import type { InterCatalogService } from '../../services/InterCatalogService';
import { DialogStackProvider } from '../uishell/DialogStackProvider';
import type { RegisterMode } from './InterUiCrudRegister';
import { UiCrudRegister } from './UiCrudRegister';

interface Row {
  id: string;
  code: string;
  name: string;
}
const config: CatalogConfig<Row> = {
  formId: 'f',
  title: 'Prueba',
  catalog: 'prueba',
  idKey: 'id',
  columns: [{ key: 'name', header: 'Nombre' }],
  fields: [
    { kind: 'text', name: 'code', label: 'Código', required: true },
    { kind: 'text', name: 'name', label: 'Nombre', required: true, uppercase: true },
  ],
};
const ORIGINAL: Row = { id: '1', code: 'C1', name: 'ALFA' };

function fakeService(overrides: Partial<InterCatalogService<Row>> = {}) {
  const fake = {
    get: vi.fn(async () => ({ ...ORIGINAL })),
    create: vi.fn(async (values: Partial<Row>) => ({ id: '9', ...values }) as Row),
    update: vi.fn(async (id: string, values: Partial<Row>) => ({ ...ORIGINAL, ...values, id })),
    remove: vi.fn(async () => undefined),
    ...overrides,
  };
  return { ...fake, service: fake as unknown as InterCatalogService<Row> };
}

async function open(mode: RegisterMode, fake = fakeService(), extra: { lookups?: () => Promise<unknown> } = {}) {
  const user = userEvent.setup();
  const onDone = vi.fn();
  const onClose = vi.fn();
  const id = mode === 'INSERT' ? undefined : '1';
  render(
    <DialogStackProvider>
      <UiCrudRegister config={config} service={fake.service} mode={mode} id={id} onDone={onDone} onClose={onClose} {...extra} />
    </DialogStackProvider>,
  );
  await waitFor(() => expect(screen.queryByText('Cargando...')).toBeNull());
  return { user, fake, onDone, onClose, field: (label: string) => screen.getByLabelText(label) as HTMLInputElement };
}
const click = (user: ReturnType<typeof userEvent.setup>, name: string) => user.click(screen.getByRole('button', { name }));

describe('UiCrudRegister flow', () => {
  it('S-CRUD-8 INSERT creates once with normalized data, closes and reports the new id', async () => {
    const { user, fake, onDone, onClose, field } = await open('INSERT');
    await user.type(field('Código'), 'c9');
    await user.type(field('Nombre'), 'beta');
    await click(user, 'Aceptar');
    expect(fake.create).not.toHaveBeenCalled();
    await click(user, 'Confirmar');
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
    expect(fake.create).toHaveBeenCalledTimes(1);
    expect(fake.create).toHaveBeenCalledWith({ code: 'c9', name: 'BETA' });
    expect(onDone).toHaveBeenCalledWith({ id: '9' });
  });

  it('S-CRUD-9 UPDATE prefills the fields and updates by id', async () => {
    const { user, fake, onDone, field } = await open('UPDATE');
    expect(field('Código').value).toBe('C1');
    await user.type(field('Nombre'), 'x');
    await click(user, 'Aceptar');
    await click(user, 'Confirmar');
    await waitFor(() => expect(onDone).toHaveBeenCalledWith({ id: '1' }));
    expect(fake.update).toHaveBeenCalledWith('1', { code: 'C1', name: 'ALFAX' });
    expect(fake.create).not.toHaveBeenCalled();
  });

  it('S-CRUD-12 CLONE prefills without the id and creates, leaving the original alone', async () => {
    const { user, fake, onDone } = await open('CLONE');
    await click(user, 'Aceptar');
    await click(user, 'Confirmar');
    await waitFor(() => expect(onDone).toHaveBeenCalledWith({ id: '9' }));
    expect(fake.create).toHaveBeenCalledWith({ code: 'C1', name: 'ALFA' });
    expect(fake.update).not.toHaveBeenCalled();
    expect(fake.remove).not.toHaveBeenCalled();
  });

  it('S-CRUD-10 DELETE is read-only, needs confirmation, and cancelling sends nothing', async () => {
    const { user, fake, onDone, onClose, field } = await open('DELETE');
    expect(field('Nombre').readOnly).toBe(true);
    await click(user, 'Aceptar');
    await click(user, 'No');
    expect(fake.remove).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();

    await click(user, 'Aceptar');
    await click(user, 'Confirmar');
    await waitFor(() => expect(onDone).toHaveBeenCalledWith({}));
    expect(fake.remove).toHaveBeenCalledWith('1');
  });

  it('S-CRUD-16 a declined confirmation sends nothing and keeps the form open with its values', async () => {
    const { user, fake, field } = await open('INSERT');
    await user.type(field('Código'), 'c9');
    await user.type(field('Nombre'), 'beta');
    await click(user, 'Aceptar');
    await click(user, 'No');
    expect(fake.create).not.toHaveBeenCalled();
    expect(field('Nombre').value).toBe('BETA');
  });

  it('S-CRUD-17 a server error keeps the dialog, shows the message and keeps the values', async () => {
    const body = { code: 'INTERNAL', message: 'Falla del servidor', details: [], traceId: 't-1' };
    const { user, onClose, field } = await open('INSERT', fakeService({ create: vi.fn().mockRejectedValue(new ApiError(500, body)) }));
    await user.type(field('Código'), 'c9');
    await user.type(field('Nombre'), 'beta');
    await click(user, 'Aceptar');
    await click(user, 'Confirmar');
    expect((await screen.findByRole('alert')).textContent).toContain('Falla del servidor');
    expect(onClose).not.toHaveBeenCalled();
    expect(field('Nombre').value).toBe('BETA');
  });

  it.each([
    { filled: {}, message: 'Código es obligatorio.', focused: 'Código' },
    { filled: { Código: 'c9' }, message: 'Nombre es obligatorio.', focused: 'Nombre' },
  ])('S-CRUD-13 required missing sends nothing, shows "$message" and focuses $focused', async ({ filled, message, focused }) => {
    const { user, fake, field } = await open('INSERT');
    for (const [label, text] of Object.entries(filled)) await user.type(field(label), text);
    await click(user, 'Aceptar');
    expect(screen.getByText(message)).toBeTruthy();
    expect(document.activeElement).toBe(field(focused));
    expect(screen.queryByText('Confirmar')).toBeNull();
    expect(fake.create).not.toHaveBeenCalled();
  });

  it('S-CRUD-11 DETAIL is read-only, has no submit button and Enter does nothing', async () => {
    const { user, fake, field } = await open('DETAIL');
    await user.type(field('Nombre'), '{Enter}');
    expect(field('Nombre').readOnly).toBe(true);
    expect(screen.queryByRole('button', { name: 'Aceptar' })).toBeNull();
    expect(screen.queryByText('Confirmar')).toBeNull();
    expect(fake.update).not.toHaveBeenCalled();
  });

  it('S-CRUD-18 Enter in a single-line field submits once', async () => {
    const { user, fake, onDone, field } = await open('INSERT');
    await user.type(field('Código'), 'c9');
    await user.type(field('Nombre'), 'beta{Enter}');
    expect(screen.getAllByRole('button', { name: 'Confirmar' })).toHaveLength(1);
    await click(user, 'Confirmar');
    await waitFor(() => expect(onDone).toHaveBeenCalledTimes(1));
    expect(fake.create).toHaveBeenCalledTimes(1);
  });

  it('S-CRUD-19 Esc closes an untouched form with no request', async () => {
    const { user, fake, onClose } = await open('UPDATE');
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(fake.update).not.toHaveBeenCalled();
  });

  it('S-CRUD-19 Esc on a dirty form asks to discard first; declining keeps it, confirming closes', async () => {
    const { user, fake, onClose, field } = await open('UPDATE');
    await user.type(field('Nombre'), 'x');
    await user.keyboard('{Escape}');
    expect(screen.getByText('Descartar cambios')).toBeTruthy();
    expect(onClose).not.toHaveBeenCalled();
    await click(user, 'No');
    expect(field('Nombre').value).toBe('ALFAX');
    await user.keyboard('{Escape}');
    await click(user, 'Confirmar');
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(fake.update).not.toHaveBeenCalled();
  });

  it('S-CRUD-20 a lookup that rejects on open shows an error and disables submit', async () => {
    const lookups = vi.fn().mockRejectedValue(new Error('Catálogo no disponible'));
    await open('INSERT', fakeService(), { lookups });
    expect((await screen.findByRole('alert')).textContent).toBe('Catálogo no disponible');
    expect((screen.getByRole('button', { name: 'Aceptar' }) as HTMLButtonElement).disabled).toBe(true);
  });

  it('a lookup that resolves leaves the form usable', async () => {
    const lookups = vi.fn().mockResolvedValue([]);
    const { field } = await open('INSERT', fakeService(), { lookups });
    expect(lookups).toHaveBeenCalledTimes(1);
    expect((screen.getByRole('button', { name: 'Aceptar' }) as HTMLButtonElement).disabled).toBe(false);
    expect(field('Código').value).toBe('');
  });
});

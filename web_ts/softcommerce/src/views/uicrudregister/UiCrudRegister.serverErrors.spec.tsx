import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { CatalogConfig } from '../../catalogs/CatalogConfig';
import { ApiError } from '../../services/ApiError';
import type { InterCatalogService } from '../../services/InterCatalogService';
import { DialogStackProvider } from '../uishell/DialogStackProvider';
import { UiCrudRegister } from './UiCrudRegister';

interface Row {
  descripcion: string;
  abrev: string;
}
const config: CatalogConfig<Row> = {
  formId: 'f', title: 'Prueba', catalog: 'prueba', idKey: 'descripcion', columns: [{ key: 'descripcion', header: 'D' }],
  fields: [
    { kind: 'text', name: 'descripcion', label: 'Descripción' },
    { kind: 'text', name: 'abrev', label: 'Abreviatura' },
  ],
};
const failure = (details: { field: string; message: string }[]) =>
  new ApiError(details.length ? 422 : 500, { code: 'VALIDATION_ERROR', message: 'Falla del servidor', details, traceId: 't-1' });

async function submitFailing(details: { field: string; message: string }[]) {
  const user = userEvent.setup();
  const onClose = vi.fn();
  const service = { create: vi.fn().mockRejectedValue(failure(details)) } as unknown as InterCatalogService<Row>;
  render(
    <DialogStackProvider>
      <UiCrudRegister config={config} service={service} mode="INSERT" onDone={vi.fn()} onClose={onClose} />
    </DialogStackProvider>,
  );
  await waitFor(() => expect(screen.queryByText('Cargando...')).toBeNull());
  await user.type(screen.getByLabelText('Descripción'), 'x');
  await user.type(screen.getByLabelText('Abreviatura'), 'y');
  await user.click(screen.getByRole('button', { name: 'Aceptar' }));
  await user.click(screen.getByRole('button', { name: 'Confirmar' }));
  return { user, onClose };
}

describe('S-CRUD-38 field-error mapping in the register', () => {
  it('shows each detail under its field, focuses the first in config order and keeps the dialog and values', async () => {
    const { onClose } = await submitFailing([{ field: 'abrev', message: 'Abreviatura repetida.' }, { field: 'descripcion', message: 'Descripción repetida.' }]);
    expect(await screen.findByText('Descripción repetida.')).toBeTruthy();
    expect(screen.getByText('Abreviatura repetida.')).toBeTruthy();
    await waitFor(() => expect(document.activeElement).toBe(screen.getByLabelText('Descripción')));
    expect((screen.getByLabelText('Abreviatura') as HTMLInputElement).value).toBe('y');
    expect(onClose).not.toHaveBeenCalled();
    expect(screen.queryByText('Falla del servidor')).toBeNull();
  });

  it('editing a field clears only its own server error', async () => {
    const { user } = await submitFailing([{ field: 'abrev', message: 'Abreviatura repetida.' }, { field: 'descripcion', message: 'Descripción repetida.' }]);
    await screen.findByText('Descripción repetida.');
    await user.type(screen.getByLabelText('Descripción'), 'z');
    expect(screen.queryByText('Descripción repetida.')).toBeNull();
    expect(screen.getByText('Abreviatura repetida.')).toBeTruthy();
  });

  it('a detail naming an unknown field, or no details at all, shows as a form-level message', async () => {
    await submitFailing([{ field: 'desconocido', message: 'Regla rara.' }]);
    expect((await screen.findByRole('alert')).textContent).toContain('Regla rara.');
  });

  it('an error without details shows the server message', async () => {
    await submitFailing([]);
    expect((await screen.findByRole('alert')).textContent).toContain('Falla del servidor');
  });
});

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { CatalogConfig } from '../../catalogs/CatalogConfig';
import type { InterCatalogService } from '../../services/InterCatalogService';
import { DialogStackProvider } from '../uishell/DialogStackProvider';
import type { RegisterMode } from './InterUiCrudRegister';
import { UiCrudRegister } from './UiCrudRegister';

interface Row {
  id: string;
  estado: string;
  tipo: string;
}
const ESTADOS = [{ value: 'A', label: 'Activo' }, { value: 'I', label: 'Inactivo' }];
const TIPOS = [{ value: 'E', label: 'Entrada' }, { value: 'S', label: 'Salida' }];
const config: CatalogConfig<Row> = {
  formId: 'miX', title: 'Tipo', catalog: 'tipos', idKey: 'id', columns: [{ key: 'estado', header: 'Estado' }],
  fields: [
    { kind: 'code', name: 'id', label: 'Código' },
    { kind: 'options', name: 'estado', label: 'Estado', display: 'select', options: ESTADOS, default: 'A' },
    { kind: 'options', name: 'tipo', label: 'Tipo de Movimiento', display: 'radio', options: TIPOS, required: true },
  ],
};

async function open(mode: RegisterMode) {
  const user = userEvent.setup();
  const service = {
    get: vi.fn(async () => ({ id: '1', estado: 'I', tipo: 'S' })),
    create: vi.fn(async (values: Partial<Row>) => ({ id: '2', ...values }) as Row),
    update: vi.fn(async () => ({ id: '1', estado: 'I', tipo: 'S' })),
    remove: vi.fn(),
  };
  render(
    <DialogStackProvider>
      <UiCrudRegister config={config} service={service as unknown as InterCatalogService<Row>} mode={mode} id={mode === 'INSERT' ? undefined : '1'} onDone={vi.fn()} onClose={vi.fn()} />
    </DialogStackProvider>,
  );
  await waitFor(() => expect(screen.queryByText('Cargando...')).toBeNull());
  return { user, service };
}

describe('S-CRUD-30 static options in the register', () => {
  it('INSERT shows the default label and the payload carries the code', async () => {
    const { user, service } = await open('INSERT');
    expect((screen.getByLabelText('Estado') as HTMLSelectElement).selectedOptions[0].textContent).toBe('Activo');
    await user.click(screen.getByRole('radio', { name: 'Entrada' }));
    await user.click(screen.getByRole('button', { name: 'Aceptar' }));
    await user.click(screen.getByRole('button', { name: 'Confirmar' }));
    await waitFor(() => expect(service.create).toHaveBeenCalledWith({ estado: 'A', tipo: 'E' }));
  });

  it('an unchosen required option blocks the submit with a per-field error', async () => {
    const { user, service } = await open('INSERT');
    await user.click(screen.getByRole('button', { name: 'Aceptar' }));
    expect(screen.getByText('Tipo de Movimiento es obligatorio.')).toBeTruthy();
    expect(service.create).not.toHaveBeenCalled();
  });

  it('UPDATE restores the stored codes and the radios stay editable', async () => {
    const { user } = await open('UPDATE');
    expect((screen.getByRole('radio', { name: 'Salida' }) as HTMLInputElement).checked).toBe(true);
    expect((screen.getByLabelText('Estado') as HTMLSelectElement).value).toBe('I');
    await user.click(screen.getByRole('radio', { name: 'Entrada' }));
    expect((screen.getByRole('radio', { name: 'Entrada' }) as HTMLInputElement).checked).toBe(true);
  });

  it.each(['DETAIL', 'DELETE'] as const)('%s shows the options read-only', async (mode) => {
    await open(mode);
    expect((screen.getByLabelText('Estado') as HTMLSelectElement).disabled).toBe(true);
    expect((screen.getByRole('radio', { name: 'Salida' }) as HTMLInputElement).disabled).toBe(true);
  });
});

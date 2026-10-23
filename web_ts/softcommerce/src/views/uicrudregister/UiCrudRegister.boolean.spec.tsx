import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { CatalogConfig } from '../../catalogs/CatalogConfig';
import type { InterCatalogService } from '../../services/InterCatalogService';
import { DialogStackProvider } from '../uishell/DialogStackProvider';
import type { RegisterMode } from './InterUiCrudRegister';
import { UiCrudRegister } from './UiCrudRegister';

interface Row {
  id_motivo: string;
  descripcion: string;
  hab_guia: boolean;
  estado: boolean;
}
const config: CatalogConfig<Row> = {
  formId: 'miMotivoTraslado', title: 'Motivo Traslado', catalog: 'motivos-traslado', idKey: 'id_motivo',
  columns: [{ key: 'descripcion', header: 'Descripción' }],
  fields: [
    { kind: 'code', name: 'id_motivo', label: 'Código' },
    { kind: 'text', name: 'descripcion', label: 'Descripción', required: true, normalize: ['upper'], uppercase: true },
    { kind: 'boolean', name: 'hab_guia', label: 'Hab Guia', default: false },
    { kind: 'boolean', name: 'estado', label: 'Activo', default: { INSERT: true }, readOnlyOn: ['INSERT', 'CLONE', 'DETAIL', 'DELETE'] },
  ],
};
const stored: Row = { id_motivo: '007', descripcion: 'VENTA', hab_guia: true, estado: false };

async function open(mode: RegisterMode) {
  const user = userEvent.setup();
  const service = {
    get: vi.fn(async () => stored),
    create: vi.fn(async (values: Partial<Row>) => ({ id_motivo: '008', ...values }) as Row),
    update: vi.fn(async () => stored),
    remove: vi.fn(async () => undefined),
  };
  render(
    <DialogStackProvider>
      <UiCrudRegister config={config} service={service as unknown as InterCatalogService<Row>} mode={mode} id={mode === 'INSERT' ? undefined : '007'} onDone={vi.fn()} onClose={vi.fn()} />
    </DialogStackProvider>,
  );
  await waitFor(() => expect(screen.queryByText('Cargando...')).toBeNull());
  return { user, service };
}
const box = (name: string) => screen.getByRole('checkbox', { name }) as HTMLInputElement;
const submit = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole('button', { name: 'Aceptar' }));
  await user.click(screen.getByRole('button', { name: 'Confirmar' }));
};

describe('S-CRUD-24 boolean field in the register', () => {
  it('INSERT shows the default: hab_guia unchecked and editable, estado checked and not editable', async () => {
    await open('INSERT');
    expect(box('Hab Guia').checked).toBe(false);
    expect(box('Hab Guia').disabled).toBe(false);
    expect(box('Activo').checked).toBe(true);
    expect(box('Activo').disabled).toBe(true);
  });

  it('the payload carries real booleans, estado included', async () => {
    const { user, service } = await open('INSERT');
    await user.type(screen.getByLabelText('Descripción'), 'venta');
    await user.click(box('Hab Guia'));
    await submit(user);
    await waitFor(() => expect(service.create).toHaveBeenCalledWith({ descripcion: 'VENTA', hab_guia: true, estado: true }));
  });

  it('UPDATE loads the stored booleans and estado is editable', async () => {
    const { user, service } = await open('UPDATE');
    expect(box('Hab Guia').checked).toBe(true);
    expect(box('Activo').checked).toBe(false);
    expect(box('Activo').disabled).toBe(false);
    await user.click(box('Activo'));
    await submit(user);
    await waitFor(() => expect(service.update).toHaveBeenCalledWith('007', { descripcion: 'VENTA', hab_guia: true, estado: true }));
  });

  it('CLONE copies the source estado and shows it read-only', async () => {
    const { user, service } = await open('CLONE');
    expect(box('Activo').checked).toBe(false);
    expect(box('Activo').disabled).toBe(true);
    await submit(user);
    await waitFor(() => expect(service.create).toHaveBeenCalledWith({ descripcion: 'VENTA', hab_guia: true, estado: false }));
  });

  it.each(['DETAIL', 'DELETE'] as const)('%s shows both read-only', async (mode) => {
    await open(mode);
    expect(box('Hab Guia').disabled).toBe(true);
    expect(box('Activo').disabled).toBe(true);
    expect(box('Hab Guia').checked).toBe(true);
  });
});

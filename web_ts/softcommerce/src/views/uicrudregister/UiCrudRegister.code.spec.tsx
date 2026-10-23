import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { CatalogConfig } from '../../catalogs/CatalogConfig';
import type { InterCatalogService } from '../../services/InterCatalogService';
import { DialogStackProvider } from '../uishell/DialogStackProvider';
import type { RegisterMode } from './InterUiCrudRegister';
import { UiCrudRegister } from './UiCrudRegister';

interface Row {
  id_color: string;
  descripcion: string;
}
const config: CatalogConfig<Row> = {
  formId: 'miColor',
  title: 'Color',
  catalog: 'colores',
  idKey: 'id_color',
  columns: [{ key: 'descripcion', header: 'Descripción' }],
  fields: [
    { kind: 'code', name: 'id_color', label: 'Código' },
    { kind: 'text', name: 'descripcion', label: 'Descripción', required: true, normalize: ['upper'], uppercase: true },
  ],
};

async function open(mode: RegisterMode) {
  const user = userEvent.setup();
  const service = {
    get: vi.fn(async () => ({ id_color: '007', descripcion: 'ROJO' })),
    create: vi.fn(async (values: Partial<Row>) => ({ id_color: '008', ...values }) as Row),
    update: vi.fn(async () => ({ id_color: '007', descripcion: 'ROJO' })),
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
const code = () => screen.queryByLabelText('Código') as HTMLInputElement | null;
const submit = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole('button', { name: 'Aceptar' }));
  await user.click(screen.getByRole('button', { name: 'Confirmar' }));
};

describe('S-CRUD-34 read-only server code (G14)', () => {
  it('INSERT hides the code and the create payload carries no id', async () => {
    const { user, service } = await open('INSERT');
    expect(code()).toBeNull();
    await user.type(screen.getByLabelText('Descripción'), '  rojo ');
    await submit(user);
    await waitFor(() => expect(service.create).toHaveBeenCalledTimes(1));
    expect(service.create).toHaveBeenCalledWith({ descripcion: 'ROJO' });
  });

  it('CLONE clears and hides the code and creates without it', async () => {
    const { user, service } = await open('CLONE');
    expect(code()).toBeNull();
    await submit(user);
    await waitFor(() => expect(service.create).toHaveBeenCalledWith({ descripcion: 'ROJO' }));
  });

  it.each(['UPDATE', 'DELETE', 'DETAIL'] as const)('%s shows the code read-only, by keyboard and by paste', async (mode) => {
    const { user } = await open(mode);
    expect(code()!.value).toBe('007');
    expect(code()!.readOnly).toBe(true);
    await user.type(code()!, '9');
    await user.click(code()!);
    await user.paste('55');
    expect(code()!.value).toBe('007');
  });

  it('UPDATE never sends the code back', async () => {
    const { user, service } = await open('UPDATE');
    await submit(user);
    await waitFor(() => expect(service.update).toHaveBeenCalledWith('007', { descripcion: 'ROJO' }));
  });
});

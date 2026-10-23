import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { CatalogConfig } from '../../catalogs/CatalogConfig';
import type { InterCatalogService } from '../../services/InterCatalogService';
import { DialogStackProvider } from '../uishell/DialogStackProvider';
import { UiCrudRegister } from './UiCrudRegister';

type Row = Record<string, string>;
/** Empresa-like text fields: a RUC of digits only, a website and a correo in lower case (S-REF-4, S-REF-10). */
const config: CatalogConfig<Row> = {
  formId: 'f', title: 'Empresa', catalog: 'empresa', idKey: 'id', columns: [{ key: 'name', header: 'Nombre' }],
  fields: [
    { kind: 'text', name: 'ruc', label: 'RUC', maxLength: 11, normalize: ['digits'] },
    { kind: 'text', name: 'website', label: 'Website', maxLength: 255, normalize: ['lower'] },
  ],
};
async function open() {
  const user = userEvent.setup();
  const service = { create: vi.fn(async (v: object) => ({ id: '9', ...v })) } as unknown as InterCatalogService<Row>;
  render(
    <DialogStackProvider>
      <UiCrudRegister config={config} service={service} mode="INSERT" onDone={vi.fn()} onClose={vi.fn()} />
    </DialogStackProvider>,
  );
  await waitFor(() => expect(screen.queryByText('Cargando...')).toBeNull());
  return { user, service };
}
const box = (label: string) => screen.getByLabelText(label) as HTMLInputElement;

describe('typed and pasted input is normalized (R-CRUD-6)', () => {
  it('S-REF-10 letters typed in a digits field are ignored', async () => {
    const { user } = await open();
    await user.type(box('RUC'), '20a12-3b');
    expect(box('RUC').value).toBe('20123');
  });

  it('S-REF-10 a paste keeps its digits and still honours the max', async () => {
    const { user } = await open();
    await user.click(box('RUC'));
    await user.paste('20 123 456 789');
    expect(box('RUC').value).toBe('20123456789');
    await user.type(box('RUC'), '1');
    expect(box('RUC').value).toBe('20123456789');
  });

  it('S-REF-4 a lower-case field shows what is typed in lower case, and the payload carries it', async () => {
    const { user, service } = await open();
    await user.type(box('Website'), 'WWW.Demo.COM');
    expect(box('Website').value).toBe('www.demo.com');
    await user.click(screen.getByRole('button', { name: 'Aceptar' }));
    await user.click(await screen.findByRole('button', { name: 'Confirmar' }));
    await waitFor(() => expect(service.create).toHaveBeenCalledWith({ ruc: '', website: 'www.demo.com' }));
  });
});

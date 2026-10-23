import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { REGISTRY } from '../../mock-server/registry/index.js';
import type { InterCatalogService } from '../services/InterCatalogService';
import { DialogStackProvider } from '../views/uishell/DialogStackProvider';
import { UiCrudRegister } from '../views/uicrudregister';
import { toCatalogConfig } from './registry';

async function openInsert(slug: string) {
  const user = userEvent.setup();
  const service = { create: vi.fn(async (values: object) => ({ ...values })) } as unknown as InterCatalogService<Record<string, string>>;
  render(
    <DialogStackProvider>
      <UiCrudRegister config={toCatalogConfig(REGISTRY.bySlug.get(slug))} service={service} mode="INSERT" onDone={vi.fn()} onClose={vi.fn()} />
    </DialogStackProvider>,
  );
  await waitFor(() => expect(screen.queryByText('Cargando...')).toBeNull());
  return { user, service };
}
const box = (name: string) => screen.getByRole('checkbox', { name }) as HTMLInputElement;

// The UI half of the boolean catalogs (R-REF-5 motivos-traslado, R-REF-3 estado on clasif-clientes).
describe('motivos-traslado register form', () => {
  it('shows Hab Guia unchecked and editable, and sends it as a boolean', async () => {
    const { user, service } = await openInsert('motivos-traslado');
    expect(box('Hab Guia').checked).toBe(false);
    await user.type(screen.getByLabelText('Descripción'), 'venta');
    await user.click(box('Hab Guia'));
    await user.click(screen.getByRole('button', { name: 'Aceptar' }));
    await user.click(screen.getByRole('button', { name: 'Confirmar' }));
    await waitFor(() => expect(service.create).toHaveBeenCalledWith({ descripcion: 'VENTA', abrev: '', hab_guia: true }));
  });
});

describe('clasif-clientes register form', () => {
  it('S-REF-7 INSERT shows estado true and read-only, and sends true', async () => {
    const { user, service } = await openInsert('clasif-clientes');
    expect(box('Activo').checked).toBe(true);
    expect(box('Activo').disabled).toBe(true);
    await user.type(screen.getByLabelText('Descripción'), 'mayorista');
    await user.click(screen.getByRole('button', { name: 'Aceptar' }));
    await user.click(screen.getByRole('button', { name: 'Confirmar' }));
    await waitFor(() => expect(service.create).toHaveBeenCalledWith({ descripcion: 'MAYORISTA', estado: true }));
  });
});

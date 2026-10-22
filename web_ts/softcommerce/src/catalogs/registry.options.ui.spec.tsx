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
const radio = (name: string) => screen.getByRole('radio', { name }) as HTMLInputElement;

// The UI half of the options catalog (R-REF-4 clasif-inventarios, S-REF-6).
describe('clasif-inventarios register form', () => {
  it('shows Entrada and Salida with no default, and a missing tipo blocks the submit with the desktop text', async () => {
    const { user, service } = await openInsert('clasif-inventarios');
    expect([radio('Entrada').checked, radio('Salida').checked]).toEqual([false, false]);
    await user.type(screen.getByLabelText('Descripción'), 'compra');
    await user.type(screen.getByLabelText('Abreviatura'), 'com');
    await user.click(screen.getByRole('button', { name: 'Aceptar' }));
    expect(screen.getByText('Para agregar un Tipo de Movimiento de Inventario, debes especificar su Tipo de Movimiento.')).toBeTruthy();
    expect(service.create).not.toHaveBeenCalled();
  });

  it('S-REF-6 choosing Salida sends the code S', async () => {
    const { user, service } = await openInsert('clasif-inventarios');
    await user.type(screen.getByLabelText('Descripción'), 'venta');
    await user.type(screen.getByLabelText('Abreviatura'), 'vta');
    await user.click(radio('Salida'));
    await user.click(screen.getByRole('button', { name: 'Aceptar' }));
    await user.click(screen.getByRole('button', { name: 'Confirmar' }));
    await waitFor(() => expect(service.create).toHaveBeenCalledWith({ descripcion: 'VENTA', abrev: 'VTA', tipo: 'S' }));
  });
});

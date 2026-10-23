import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { REGISTRY } from '../../mock-server/registry/index.js';
import type { InterCatalogService } from '../services/InterCatalogService';
import type { InterLookupService } from '../services/InterLookupService';
import { DialogStackProvider } from '../views/uishell/DialogStackProvider';
import { UiCrudRegister } from '../views/uicrudregister';
import { toCatalogConfig } from './registry';

const OPTIONS: Record<string, { id: string; name: string }[]> = {
  'tipos-descuento': [{ id: '1', name: 'PORCENTAJE' }, { id: '2', name: 'MONTO FIJO' }],
  'tipos-trabajador': [{ id: '001', name: 'ADMINISTRATIVO' }, { id: '002', name: 'VENDEDOR' }],
};

async function openInsert(slug: string) {
  const user = userEvent.setup();
  const service = { create: vi.fn(async (values: object) => ({ ...values })) } as unknown as InterCatalogService<Record<string, string>>;
  const options = vi.fn(async (catalog: string, _filters?: Record<string, string>) => OPTIONS[catalog] ?? []);
  render(
    <DialogStackProvider>
      <UiCrudRegister config={toCatalogConfig(REGISTRY.bySlug.get(slug))} service={service} mode="INSERT" lookup={{ options } as unknown as InterLookupService} onDone={vi.fn()} onClose={vi.fn()} />
    </DialogStackProvider>,
  );
  await waitFor(() => expect(screen.queryByText('Cargando...')).toBeNull());
  return { user, service, options };
}
const field = (label: string) => screen.getByLabelText(label) as HTMLInputElement;
const submit = (user: ReturnType<typeof userEvent.setup>) => user.click(screen.getByRole('button', { name: 'Aceptar' }));

// The UI half of the catalog-select catalogs (R-REF-5, S-REF-9).
describe('motivos-descuento register form', () => {
  it('S-REF-9 a missing tipo blocks the submit with su Tipo Dscto, and no request is sent', async () => {
    const { user, service } = await openInsert('motivos-descuento');
    await user.type(field('Descripción'), 'pronto pago');
    await user.type(field('Abrev'), 'pp');
    await submit(user);
    expect(screen.getByText('Para agregar un Motivo Descuento, debes especificar su Tipo Dscto.')).toBeTruthy();
    expect(service.create).not.toHaveBeenCalled();
  });

  it('a blank abrev says Abrev, not Descripcion, and comes before the tipo', async () => {
    const { user } = await openInsert('motivos-descuento');
    await user.type(field('Descripción'), 'x');
    await submit(user);
    expect(screen.getByText('Para agregar un Motivo Descuento, debes especificar su Abrev.')).toBeTruthy();
  });

  it('lists the tipos de descuento by name and sends the chosen id', async () => {
    const { user, service, options } = await openInsert('motivos-descuento');
    expect(options).toHaveBeenCalledWith('tipos-descuento', undefined);
    await user.type(field('Descripción'), 'pronto pago');
    await user.type(field('Abrev'), 'pp');
    await user.selectOptions(field('Tipo Dscto'), 'PORCENTAJE');
    await submit(user);
    await user.click(screen.getByRole('button', { name: 'Confirmar' }));
    await waitFor(() => expect(service.create).toHaveBeenCalledWith({ descripcion: 'PRONTO PAGO', abrev: 'PP', id_tipo_descuento: '1' }));
  });
});

describe('motivos-nc register form', () => {
  it('checks the tipo first, with the real entity in the message', async () => {
    const { user } = await openInsert('motivos-nc');
    await submit(user);
    expect(screen.getByText('Para agregar un Motivo de Nota de Crédito, debes especificar su Tipo.')).toBeTruthy();
    expect(screen.queryByText('Para agregar un Motivo de Nota de Crédito, debes especificar su Descripcion.')).toBeNull();
  });

  it('then the descripcion, and sends the chosen tipo code', async () => {
    const { user, service } = await openInsert('motivos-nc');
    await user.selectOptions(field('Tipo'), 'NOTA CREDITO VENTA');
    await submit(user);
    expect(screen.getByText('Para agregar un Motivo de Nota de Crédito, debes especificar su Descripcion.')).toBeTruthy();
    await user.type(field('Descripción'), 'anulacion');
    await submit(user);
    await user.click(screen.getByRole('button', { name: 'Confirmar' }));
    await waitFor(() => expect(service.create).toHaveBeenCalledWith({ tipo: 'C', descripcion: 'ANULACION' }));
  });
});

describe('tipos-trabajador-perfil register form', () => {
  it('asks only for the active tipos trabajador (estado true) and checks the descripcion first', async () => {
    const { user, options } = await openInsert('tipos-trabajador-perfil');
    expect(options).toHaveBeenCalledWith('tipos-trabajador', { estado: 'true' });
    await submit(user);
    expect(screen.getByText('Para agregar un Perfil, debes especificar su Descripcion.')).toBeTruthy();
    await user.type(field('Descripción'), 'cajero');
    await submit(user);
    expect(screen.getByText('Para agregar un Perfil, debes especificar su Tipo Trabajador.')).toBeTruthy();
  });
});

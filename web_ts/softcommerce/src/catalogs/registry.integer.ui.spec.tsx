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
const field = (label: string) => screen.getByLabelText(label) as HTMLInputElement;
const radio = (name: string) => screen.getByRole('radio', { name }) as HTMLInputElement;
const confirm = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole('button', { name: 'Aceptar' }));
  await user.click(screen.getByRole('button', { name: 'Confirmar' }));
};

// The UI half of the integer catalogs (R-REF-5 condiciones-pago, tipos-trabajador and marcas-vehiculo, S-REF-5).
describe('condiciones-pago register form', () => {
  it('S-REF-5 a blank dias_pago blocks the submit with the desktop text', async () => {
    const { user, service } = await openInsert('condiciones-pago');
    await user.type(field('Descripción'), 'credito');
    await user.click(screen.getByRole('button', { name: 'Aceptar' }));
    expect(screen.getByText('Para agregar una Condición de Pago, debes especificar sus Dias de Pago.')).toBeTruthy();
    expect(service.create).not.toHaveBeenCalled();
  });

  it('S-REF-5 abc typed in dias_pago is ignored, and 0 with a tipo is accepted and sent as the number 0', async () => {
    const { user, service } = await openInsert('condiciones-pago');
    await user.type(field('Descripción'), 'contado');
    await user.type(field('Dias de Pago'), 'abc');
    expect(field('Dias de Pago').value).toBe('');
    await user.type(field('Dias de Pago'), '0');
    await user.click(radio('Contado'));
    await confirm(user);
    await waitFor(() => expect(service.create).toHaveBeenCalledWith({ descripcion: 'CONTADO', dias_pago: 0, tipo: 'CO' }));
  });

  it('S-REF-5 no tipo blocks the submit with su Tipo de Pago, and lists the four payment types', async () => {
    const { user, service } = await openInsert('condiciones-pago');
    expect(['Crédito', 'Contado', 'Operación Bancaria', 'Tarjeta'].map((name) => radio(name).checked)).toEqual([false, false, false, false]);
    await user.type(field('Descripción'), 'x');
    await user.type(field('Dias de Pago'), '30');
    await user.click(screen.getByRole('button', { name: 'Aceptar' }));
    expect(screen.getByText('Para agregar una Condición de Pago, debes especificar su Tipo de Pago.')).toBeTruthy();
    expect(service.create).not.toHaveBeenCalled();
  });

  it('dias_pago accepts at most two digits', async () => {
    const { user } = await openInsert('condiciones-pago');
    await user.type(field('Dias de Pago'), '123');
    expect(field('Dias de Pago').value).toBe('12');
  });
});

describe('tipos-trabajador and marcas-vehiculo register forms (M2)', () => {
  it('tipos-trabajador says su Abrev for a blank abreviatura, after descripcion', async () => {
    const { user, service } = await openInsert('tipos-trabajador');
    await user.click(screen.getByRole('button', { name: 'Aceptar' }));
    expect(screen.getByText('Para agregar, debes especificar su Descripcion.')).toBeTruthy();
    await user.type(field('Descripción'), 'obrero');
    await user.click(screen.getByRole('button', { name: 'Aceptar' }));
    expect(screen.getByText('Para agregar, debes especificar su Abrev.')).toBeTruthy();
    expect(service.create).not.toHaveBeenCalled();
  });

  it('marcas-vehiculo sends the estado that INSERT forces', async () => {
    const { user, service } = await openInsert('marcas-vehiculo');
    await user.type(field('Descripción'), 'toyota');
    await confirm(user);
    await waitFor(() => expect(service.create).toHaveBeenCalledWith({ descripcion: 'TOYOTA', estado: true }));
  });
});

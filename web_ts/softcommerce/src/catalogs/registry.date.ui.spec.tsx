import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { REGISTRY } from '../../mock-server/registry/index.js';
import type { InterCatalogService } from '../services/InterCatalogService';
import { createAppServicesMock } from '../services/mock/AppServicesMock';
import { DialogStackProvider } from '../views/uishell/DialogStackProvider';
import { UiCrudRegister } from '../views/uicrudregister';
import type { RegisterMode } from '../views/uicrudregister/InterUiCrudRegister';
import { toCatalogConfig } from './registry';

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date(2026, 5, 15, 12, 0));
});
afterEach(() => vi.useRealTimers());

const DUPLICATE = 'La fecha del Tipo Cambio ya se encuentra registrado para esa moneda, por favor ingrese otra fecha o seleccione otra moneda.';
const mock = () => createAppServicesMock('exitoso', { getSession: () => ({ tenantId: 'demo' }), getRequestContext: () => ({ userId: '7', empresaId: '1' }), delayMs: 0 });

/** The register of a catalog over the real in-browser mock (the services the shell composes in mock mode). */
async function open(slug: string, mode: RegisterMode = 'INSERT', id?: string, service?: InterCatalogService<Record<string, unknown>>) {
  const services = mock();
  const onDone = vi.fn();
  const user = userEvent.setup();
  render(
    <DialogStackProvider>
      <UiCrudRegister config={toCatalogConfig(REGISTRY.bySlug.get(slug))} service={(service ?? services.catalog(slug)) as InterCatalogService<Record<string, string>>} mode={mode} id={id} lookup={services.lookup} onDone={onDone} onClose={vi.fn()} />
    </DialogStackProvider>,
  );
  await waitFor(() => expect(screen.queryByText('Cargando...')).toBeNull());
  return { user, onDone };
}
const field = (label: string) => screen.getByLabelText(label) as HTMLInputElement;
const submit = (user: ReturnType<typeof userEvent.setup>) => user.click(screen.getByRole('button', { name: 'Aceptar' }));
const confirm = async (user: ReturnType<typeof userEvent.setup>) => {
  await submit(user);
  await user.click(screen.getByRole('button', { name: 'Confirmar' }));
};
const retype = async (user: ReturnType<typeof userEvent.setup>, label: string, text: string) => {
  await user.clear(field(label));
  await user.type(field(label), text);
};

describe('tipos-cambio register form (R-REF-6, R-REF-7, S-REF-19)', () => {
  it('S-REF-39 has no nested moneda button: the form is the code, the date, the moneda and the four amounts', async () => {
    expect(toCatalogConfig(REGISTRY.bySlug.get('tipos-cambio')).fields.map((f) => `${f.kind}:${f.name}`)).toEqual([
      'code:id_tipo_cambio', 'date:fecha', 'select:id_moneda', 'number:monto_compra', 'number:monto_venta', 'number:monto_comercial', 'number:monto_especial',
    ]);
    await open('tipos-cambio');
    expect(screen.queryByRole('button', { name: /moneda/i })).toBeNull();
  });

  it('S-REF-19 a fresh INSERT shows today, DOLAR AMERICANO read-only, and four amounts at 0.0', async () => {
    await open('tipos-cambio');
    expect(field('Fecha').value).toBe('15/06/2026');
    expect((field('Moneda') as unknown as HTMLSelectElement).selectedOptions[0].textContent).toBe('DOLAR AMERICANO');
    expect(field('Moneda').disabled).toBe(true);
    expect(['Monto de Compra', 'Monto de Venta', 'Monto Comercial', 'Monto Especial'].map((label) => field(label).value)).toEqual(['0.0', '0.0', '0.0', '0.0']);
  });

  it('S-REF-19 a blank amount shows 0.0 when focus leaves', async () => {
    const { user } = await open('tipos-cambio');
    await user.clear(field('Monto Especial'));
    await user.tab();
    expect(field('Monto Especial').value).toBe('0.0');
  });

  it('S-REF-19 an empty or impossible date shows the invalid-date message first, and nothing is sent', async () => {
    const { user, onDone } = await open('tipos-cambio');
    await user.clear(field('Fecha'));
    await submit(user);
    expect(screen.getByText('La fecha del Tipo de Cambio que has especificado no es válida. Compruébala e inténtalo de nuevo.')).toBeTruthy();
    await retype(user, 'Fecha', '31022026');
    await submit(user);
    expect(screen.getByText('La fecha del Tipo de Cambio que has especificado no es válida. Compruébala e inténtalo de nuevo.')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Confirmar' })).toBeNull();
    expect(onDone).not.toHaveBeenCalled();
  });

  it('S-REF-19 monto_compra 0 is rejected by the server after the date and the duplicate checks, under its own field', async () => {
    const { user, onDone } = await open('tipos-cambio');
    await confirm(user);
    expect(await screen.findByText('Para agregar un Tipo de Cambio , debes especificar su Monto de Compra.')).toBeTruthy();
    expect(field('Monto de Compra').getAttribute('aria-invalid')).toBe('true');
    expect(onDone).not.toHaveBeenCalled();
  });

  it('S-REF-18 a duplicate (empresa, fecha, moneda) is a 409 shown under the fecha field (G6)', async () => {
    const { user } = await open('tipos-cambio');
    await retype(user, 'Fecha', '15012026');
    for (const label of ['Monto de Compra', 'Monto de Venta', 'Monto Comercial', 'Monto Especial']) await retype(user, label, '3.7');
    await confirm(user);
    expect(await screen.findByText(DUPLICATE)).toBeTruthy();
    expect(field('Fecha').getAttribute('aria-invalid')).toBe('true');
  });

  it('S-CRUD-27 a new date with positive amounts is created and reported done', async () => {
    const { user, onDone } = await open('tipos-cambio');
    await retype(user, 'Fecha', '20012026');
    for (const label of ['Monto de Compra', 'Monto de Venta', 'Monto Comercial', 'Monto Especial']) await retype(user, label, '3.456789');
    await confirm(user);
    await waitFor(() => expect(onDone).toHaveBeenCalledWith({ id: '005' }));
  });

  it('S-REF-19 CLONE of a past record sets the fecha to today, keeps the moneda read-only and the amounts as stored', async () => {
    await open('tipos-cambio', 'CLONE', '001');
    expect(field('Fecha').value).toBe('15/06/2026');
    expect(field('Moneda').disabled).toBe(true);
    expect(field('Monto de Compra').value).toBe('3.71');
  });

  it('UPDATE keeps the stored date and shows the amounts with no rounding', async () => {
    await open('tipos-cambio', 'UPDATE', '003');
    expect(field('Fecha').value).toBe('17/01/2026');
    expect(field('Monto de Venta').value).toBe('3.7234');
  });
});

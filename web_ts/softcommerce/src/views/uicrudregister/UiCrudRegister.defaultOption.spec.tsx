import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { CatalogConfig } from '../../catalogs/CatalogConfig';
import type { InterCatalogService } from '../../services/InterCatalogService';
import type { InterLookupService } from '../../services/InterLookupService';
import { DialogStackProvider } from '../uishell/DialogStackProvider';
import { UiCrudRegister } from './UiCrudRegister';

type Row = Record<string, string>;
/** A tipo (E / S) whose clasificacion selects its first option after each load (S-CRUD-41, S-REF-23). */
const config: CatalogConfig<Row> = {
  formId: 'f', title: 'Prueba', catalog: 'prueba', idKey: 'id', columns: [{ key: 'descripcion', header: 'Descripción' }],
  fields: [
    { kind: 'options', name: 'tipo', label: 'Tipo', display: 'select', options: [{ value: 'E', label: 'E' }, { value: 'S', label: 'S' }, { value: 'X', label: 'X' }], default: 'E' },
    { kind: 'select', name: 'id_clasif', label: 'Clasificacion', source: { catalog: 'clasif' }, dependsOn: [{ field: 'tipo', filterKey: 'tipo' }], defaultOption: 'first' },
  ],
};
const CLASIF: Record<string, { id: string; name: string }[]> = { E: [{ id: '1', name: 'COMPRA' }, { id: '2', name: 'AJUSTE' }], S: [{ id: '3', name: 'VENTA' }], X: [] };

const lookup = () => ({ options: vi.fn(async (_slug: string, filters?: Record<string, string>) => CLASIF[filters?.tipo ?? ''] ?? []) }) as unknown as InterLookupService;
type Mode = 'INSERT' | 'UPDATE' | 'DETAIL';
async function open(mode: Mode, record: Row = { id: '1', tipo: 'S', id_clasif: '3' }) {
  const user = userEvent.setup();
  const service = { get: vi.fn(async () => record), create: vi.fn(async (v: object) => ({ id: '9', ...v })), update: vi.fn() } as unknown as InterCatalogService<Row>;
  const onClose = vi.fn();
  render(
    <DialogStackProvider>
      <UiCrudRegister config={config} service={service} mode={mode} id={mode === 'INSERT' ? undefined : '1'} lookup={lookup()} onDone={vi.fn()} onClose={onClose} />
    </DialogStackProvider>,
  );
  await waitFor(() => expect(screen.queryByText('Cargando...')).toBeNull());
  return { user, service, onClose };
}
const sel = (label: string) => screen.getByLabelText(label) as HTMLSelectElement;

describe('defaultOption first in the register (S-CRUD-41)', () => {
  it('a fresh INSERT starts on tipo E with the first clasificacion selected', async () => {
    await open('INSERT');
    await waitFor(() => expect(sel('Clasificacion').value).toBe('1'));
  });

  it('changing the tipo reloads the clasificaciones and selects the first of the new list', async () => {
    const { user } = await open('INSERT');
    await waitFor(() => expect(sel('Clasificacion').value).toBe('1'));
    await user.selectOptions(sel('Tipo'), 'S');
    await waitFor(() => expect(sel('Clasificacion').value).toBe('3'));
    await user.selectOptions(sel('Tipo'), 'E');
    await waitFor(() => expect(sel('Clasificacion').value).toBe('1'));
  });

  it('a tipo whose load returns no options leaves the clasificacion empty', async () => {
    const { user } = await open('INSERT');
    await waitFor(() => expect(sel('Clasificacion').value).toBe('1'));
    await user.selectOptions(sel('Tipo'), 'X');
    await waitFor(() => expect(sel('Clasificacion').value).toBe(''));
  });

  it('UPDATE restores the saved clasificacion instead of the first', async () => {
    await open('UPDATE', { id: '1', tipo: 'E', id_clasif: '2' });
    await waitFor(() => expect(sel('Clasificacion').value).toBe('2'));
  });

  it('DETAIL keeps the saved value untouched', async () => {
    await open('DETAIL', { id: '1', tipo: 'S', id_clasif: '3' });
    await waitFor(() => expect(sel('Clasificacion').value).toBe('3'));
  });

  it('an untouched INSERT closes without the discard confirmation: the selected default is the baseline', async () => {
    const { user, onClose } = await open('INSERT');
    await waitFor(() => expect(sel('Clasificacion').value).toBe('1'));
    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(onClose).toHaveBeenCalled();
    expect(screen.queryByText('¿Descartar los cambios sin guardar?')).toBeNull();
  });

  it('the selected default is what the INSERT sends', async () => {
    const { user, service } = await open('INSERT');
    await waitFor(() => expect(sel('Clasificacion').value).toBe('1'));
    await user.click(screen.getByRole('button', { name: 'Aceptar' }));
    await user.click(await screen.findByRole('button', { name: 'Confirmar' }));
    await waitFor(() => expect(service.create).toHaveBeenCalledWith(expect.objectContaining({ tipo: 'E', id_clasif: '1' })));
  });
});

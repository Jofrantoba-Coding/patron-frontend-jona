import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { CatalogConfig } from '../../catalogs/CatalogConfig';
import type { InterCatalogService } from '../../services/InterCatalogService';
import type { InterLookupService } from '../../services/InterLookupService';
import { DialogStackProvider } from '../uishell/DialogStackProvider';
import { UiCrudRegister } from './UiCrudRegister';

type Row = Record<string, string>;
const config: CatalogConfig<Row> = {
  formId: 'f', title: 'Prueba', catalog: 'prueba', idKey: 'id', columns: [{ key: 'descripcion', header: 'Descripción' }],
  fields: [
    { kind: 'text', name: 'descripcion', label: 'Descripción', required: true },
    { kind: 'select', name: 'id_tipo_trabajador', label: 'Tipo Trabajador', required: true, source: { catalog: 'tipos-trabajador', where: { estado: 'true' } } },
    { kind: 'select', name: 'id_opcional', label: 'Opcional', source: { catalog: 'opcionales' } },
  ],
};
const ITEMS = [{ id: '001', name: 'OBRERO' }, { id: '002', name: 'EMPLEADO' }];

function fakeLookup(options = vi.fn(async (_slug: string, _filters?: Record<string, string>) => ITEMS)) {
  return { options, lookup: { options } as unknown as InterLookupService };
}
async function open(mode: 'INSERT' | 'UPDATE', lookup: InterLookupService, record: Row = { id: '1', descripcion: 'X', id_tipo_trabajador: '002', id_opcional: '' }) {
  const user = userEvent.setup();
  const service = { get: vi.fn(async () => record), create: vi.fn(async (v: object) => ({ id: '9', ...v })), update: vi.fn(async (id: string, v: object) => ({ id, ...v })) } as unknown as InterCatalogService<Row>;
  render(
    <DialogStackProvider>
      <UiCrudRegister config={config} service={service} mode={mode} id={mode === 'INSERT' ? undefined : '1'} lookup={lookup} onDone={vi.fn()} onClose={vi.fn()} />
    </DialogStackProvider>,
  );
  await waitFor(() => expect(screen.queryByText('Cargando...')).toBeNull());
  return { user, service };
}
const tipo = () => screen.getByLabelText('Tipo Trabajador') as HTMLSelectElement;

describe('UiCrudRegister catalog select (S-CRUD-29)', () => {
  it('loads each select from the lookup of its catalog and forwards the static where as filters', async () => {
    const { options, lookup } = fakeLookup();
    await open('INSERT', lookup);
    expect(options).toHaveBeenCalledWith('tipos-trabajador', { estado: 'true' });
    expect(options).toHaveBeenCalledWith('opcionales', undefined);
    expect([...tipo().options].map((o) => o.textContent)).toEqual(['--- Seleccione ---', 'OBRERO', 'EMPLEADO']);
  });

  it('a chosen name travels as its id in the payload', async () => {
    const { lookup } = fakeLookup();
    const { user, service } = await open('INSERT', lookup);
    await user.type(screen.getByLabelText('Descripción'), 'x');
    await user.selectOptions(tipo(), 'OBRERO');
    await user.click(screen.getByRole('button', { name: 'Aceptar' }));
    await user.click(screen.getByRole('button', { name: 'Confirmar' }));
    await waitFor(() => expect(service.create).toHaveBeenCalledWith({ descripcion: 'x', id_tipo_trabajador: '001', id_opcional: '' }));
  });

  it('UPDATE shows the stored id as the selected name', async () => {
    const { lookup } = fakeLookup();
    await open('UPDATE', lookup);
    expect(tipo().value).toBe('002');
  });

  it('a required select left unchosen blocks the submit with its own message', async () => {
    const { lookup } = fakeLookup();
    const { user, service } = await open('INSERT', lookup);
    await user.type(screen.getByLabelText('Descripción'), 'x');
    await user.click(screen.getByRole('button', { name: 'Aceptar' }));
    expect(screen.getByText('Tipo Trabajador es obligatorio.')).toBeTruthy();
    expect(service.create).not.toHaveBeenCalled();
  });

  it('S-CRUD-20 a lookup that rejects shows the error and disables submit', async () => {
    const { lookup } = fakeLookup(vi.fn().mockRejectedValue(new Error('Catálogo no disponible')));
    await open('INSERT', lookup);
    expect(screen.getByRole('alert').textContent).toContain('Catálogo no disponible');
    expect((screen.getByRole('button', { name: 'Aceptar' }) as HTMLButtonElement).disabled).toBe(true);
  });
});

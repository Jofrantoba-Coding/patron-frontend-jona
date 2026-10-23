import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { CatalogConfig } from '../../catalogs/CatalogConfig';
import type { InterCatalogService } from '../../services/InterCatalogService';
import type { InterLookupService } from '../../services/InterLookupService';
import { DialogStackProvider } from '../uishell/DialogStackProvider';
import { UiCrudRegister } from './UiCrudRegister';

type Row = Record<string, string>;
/** An optional ubigeo cascade that is the parent of a select (R-CRUD-12, W2-8 8.3): the zona of a distrito. */
const config: CatalogConfig<Row> = {
  formId: 'f', title: 'Prueba', catalog: 'prueba', idKey: 'id', columns: [{ key: 'descripcion', header: 'Descripción' }],
  fields: [
    {
      kind: 'cascade', name: 'id_ubigeo', lookup: 'ubigeo',
      levels: [{ name: 'id_departamento', label: 'Departamento' }, { name: 'id_provincia', label: 'Provincia' }, { name: 'id_ubigeo', label: 'Distrito' }],
      ancestorsOf: (leaf) => [leaf.slice(0, 2), leaf.slice(0, 4)],
    },
    { kind: 'select', name: 'id_zona', label: 'Zona', source: { catalog: 'zonas' }, dependsOn: [{ field: 'id_ubigeo', filterKey: 'id_ubigeo' }] },
  ],
};
const TREE: Record<string, { id: string; name: string }[]> = {
  '': [{ id: '15', name: 'LIMA' }, { id: '08', name: 'CUSCO' }],
  '15': [{ id: '1501', name: 'LIMA' }],
  '08': [{ id: '0801', name: 'CUSCO' }],
  '1501': [{ id: '150101', name: 'LIMA CENTRO' }, { id: '150102', name: 'ANCON' }],
  '0801': [{ id: '080101', name: 'CUSCO CENTRO' }],
};
const ZONAS: Record<string, { id: string; name: string }[]> = {
  '150101': [{ id: '1', name: 'NORTE' }, { id: '2', name: 'SUR' }],
  '080101': [{ id: '3', name: 'ANDINA' }],
};
const RECORD: Row = { id: '1', id_ubigeo: '150101', id_zona: '2' };

function fakeLookup() {
  const options = vi.fn(async (_slug: string, filters?: Record<string, string>) => ZONAS[filters?.id_ubigeo ?? ''] ?? []);
  const ubigeoChildren = vi.fn(async (parent = '') => TREE[parent] ?? []);
  return { options, lookup: { options, ubigeoChildren } as unknown as InterLookupService };
}
async function open(mode: 'INSERT' | 'UPDATE' | 'DETAIL', lookup: InterLookupService) {
  const user = userEvent.setup();
  const service = { get: vi.fn(async () => RECORD), create: vi.fn(async (v: object) => ({ id: '9', ...v })), update: vi.fn(async (id: string, v: object) => ({ id, ...v })) } as unknown as InterCatalogService<Row>;
  render(
    <DialogStackProvider>
      <UiCrudRegister config={config} service={service} mode={mode} id={mode === 'INSERT' ? undefined : '1'} lookup={lookup} onDone={vi.fn()} onClose={vi.fn()} />
    </DialogStackProvider>,
  );
  await waitFor(() => expect(screen.queryByText('Cargando...')).toBeNull());
  return { user, service };
}
const sel = (label: string) => screen.getByLabelText(label) as HTMLSelectElement;
const names = (label: string) => [...sel(label).options].map((o) => o.textContent);
const choose = async (user: ReturnType<typeof userEvent.setup>, label: string, text: string) => {
  await waitFor(() => expect(names(label)).toContain(text));
  await user.selectOptions(sel(label), text);
};

describe('a ubigeo cascade as the parent of a select (R-CRUD-12, 8.3)', () => {
  it('the zona stays disabled and empty until the distrito is chosen, then loads with the leaf as its filterKey', async () => {
    const { options, lookup } = fakeLookup();
    const { user } = await open('INSERT', lookup);
    expect(sel('Zona').disabled).toBe(true);
    expect(options).not.toHaveBeenCalled();
    await choose(user, 'Departamento', 'LIMA');
    await choose(user, 'Provincia', 'LIMA');
    expect(sel('Zona').disabled).toBe(true);
    await choose(user, 'Distrito', 'LIMA CENTRO');
    await waitFor(() => expect(names('Zona')).toEqual(['--- Seleccione ---', 'NORTE', 'SUR']));
    expect(options).toHaveBeenCalledWith('zonas', { id_ubigeo: '150101' });
    expect(sel('Zona').disabled).toBe(false);
  });

  it('changing a level above the distrito clears the leaf and with it the zona, which blocks again', async () => {
    const { lookup } = fakeLookup();
    const { user } = await open('UPDATE', lookup);
    await waitFor(() => expect(sel('Zona').value).toBe('2'));
    await user.selectOptions(sel('Departamento'), 'CUSCO');
    expect([sel('Distrito').value, sel('Zona').value]).toEqual(['', '']);
    await waitFor(() => expect(sel('Zona').disabled).toBe(true));
    expect(names('Zona')).toEqual(['--- Seleccione ---']);
  });

  it('the cleared zona does not travel: a stale id would otherwise be saved under the new departamento', async () => {
    const { lookup } = fakeLookup();
    const { user, service } = await open('UPDATE', lookup);
    await waitFor(() => expect(sel('Zona').value).toBe('2'));
    await user.selectOptions(sel('Departamento'), 'CUSCO');
    await user.click(screen.getByRole('button', { name: 'Aceptar' }));
    await user.click(await screen.findByRole('button', { name: 'Confirmar' }));
    await waitFor(() => expect(service.update).toHaveBeenCalledWith('1', { id_ubigeo: '', id_zona: '' }));
  });

  it('S-CRUD-32 UPDATE restores every cascade level and the zona with its options loaded', async () => {
    const { options, lookup } = fakeLookup();
    await open('UPDATE', lookup);
    await waitFor(() => expect([sel('Departamento').value, sel('Provincia').value, sel('Distrito').value, sel('Zona').value]).toEqual(['15', '1501', '150101', '2']));
    expect(options).toHaveBeenCalledWith('zonas', { id_ubigeo: '150101' });
    expect(sel('Zona').disabled).toBe(false);
  });

  it('S-CRUD-32 DETAIL loads the options so the saved names show, and nothing is editable', async () => {
    const { lookup } = fakeLookup();
    await open('DETAIL', lookup);
    await waitFor(() => expect(sel('Zona').value).toBe('2'));
    expect([sel('Departamento').disabled, sel('Distrito').disabled, sel('Zona').disabled]).toEqual([true, true, true]);
  });

  it('an optional cascade does not block: nothing chosen submits, the zona stays empty and no transient level travels', async () => {
    const { lookup } = fakeLookup();
    const { user, service } = await open('INSERT', lookup);
    await user.click(screen.getByRole('button', { name: 'Aceptar' }));
    await user.click(await screen.findByRole('button', { name: 'Confirmar' }));
    await waitFor(() => expect(service.create).toHaveBeenCalledWith({ id_ubigeo: '', id_zona: '' }));
  });

  it('a partly chosen optional cascade does not block either', async () => {
    const { lookup } = fakeLookup();
    const { user, service } = await open('INSERT', lookup);
    await choose(user, 'Departamento', 'LIMA');
    await user.click(screen.getByRole('button', { name: 'Aceptar' }));
    await user.click(await screen.findByRole('button', { name: 'Confirmar' }));
    await waitFor(() => expect(service.create).toHaveBeenCalledWith({ id_ubigeo: '', id_zona: '' }));
  });
});

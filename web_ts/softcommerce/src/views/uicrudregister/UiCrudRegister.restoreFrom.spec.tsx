import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { CatalogConfig } from '../../catalogs/CatalogConfig';
import type { InterCatalogService } from '../../services/InterCatalogService';
import type { InterLookupService } from '../../services/InterLookupService';
import { DialogStackProvider } from '../uishell/DialogStackProvider';
import { UiCrudRegister } from './UiCrudRegister';

type Row = Record<string, string>;
/**
 * The ZonaDistancia chain A (R-CRUD-12, 11.0): a ubigeo cascade that is `transient` (its levels never travel), filtered to the ubigeos with an
 * active zona and restored from the ubigeo code the record carries (`id_ubigeo`, the distrito of the stored zona), then the zona that depends on it.
 */
const config: CatalogConfig<Row> = {
  formId: 'f', title: 'Prueba', catalog: 'prueba', idKey: 'id', columns: [{ key: 'id_zona', header: 'Zona' }],
  fields: [
    {
      kind: 'cascade', name: 'id_distrito', lookup: 'ubigeo', required: true, transient: true, filter: { has: 'zonas' }, restoreFrom: { field: 'id_ubigeo', prefixLen: 6 },
      levels: [{ name: 'id_departamento', label: 'Departamento', article: 'un' }, { name: 'id_provincia', label: 'Provincia', article: 'una' }, { name: 'id_distrito', label: 'Distrito', article: 'un' }],
      ancestorsOf: (leaf) => [leaf.slice(0, 2), leaf.slice(0, 4)],
    },
    { kind: 'select', name: 'id_zona', label: 'Zona', required: true, source: { catalog: 'zonas' }, dependsOn: [{ field: 'id_distrito', filterKey: 'id_ubigeo' }] },
    { kind: 'number', name: 'distancia', label: 'Distancia', scale: 2, required: true },
  ],
};
// Only the ubigeos with an active zona: the filtered tree, so the plain W1 children (which would also list CUSCO) are never asked.
const TREE: Record<string, { id: string; name: string }[]> = {
  '': [{ id: '15', name: 'LIMA' }],
  '15': [{ id: '1501', name: 'LIMA' }],
  '1501': [{ id: '150101', name: 'LIMA CENTRO' }, { id: '150103', name: 'ATE' }],
};
const ZONAS: Record<string, { id: string; name: string }[]> = { '150101': [{ id: '1', name: 'NORTE' }, { id: '2', name: 'SUR' }] };
const RECORD: Row = { id: '1', id_zona: '2', id_ubigeo: '150101', distancia: '12.5' };

function fakeLookup() {
  const options = vi.fn(async (slug: string, filters?: Record<string, string>) => (slug === 'ubigeo' ? TREE[filters?.parent ?? ''] ?? [] : ZONAS[filters?.id_ubigeo ?? ''] ?? []));
  const ubigeoChildren = vi.fn(async () => [{ id: '08', name: 'CUSCO' }]);
  return { options, ubigeoChildren, lookup: { options, ubigeoChildren } as unknown as InterLookupService };
}
async function open(mode: 'INSERT' | 'UPDATE' | 'CLONE' | 'DETAIL', lookup: InterLookupService, record: Row = RECORD) {
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
const sel = (label: string) => screen.getByLabelText(label) as HTMLSelectElement;
const levels = () => [sel('Departamento').value, sel('Provincia').value, sel('Distrito').value, sel('Zona').value];

describe('the cascade filter (has: zonas) travels with every level request', () => {
  it('asks the lookup for the filtered children, never the plain ubigeo route', async () => {
    const { options, ubigeoChildren, lookup } = fakeLookup();
    const { user } = await open('INSERT', lookup);
    await waitFor(() => expect(options).toHaveBeenCalledWith('ubigeo', { parent: '', has: 'zonas' }));
    await waitFor(() => expect([...sel('Departamento').options].map((o) => o.textContent)).toContain('LIMA'));
    await user.selectOptions(sel('Departamento'), 'LIMA');
    await waitFor(() => expect(options).toHaveBeenCalledWith('ubigeo', { parent: '15', has: 'zonas' }));
    expect(ubigeoChildren).not.toHaveBeenCalled();
  });
});

describe('restoreFrom rebuilds the transient levels from the ubigeo code of the record', () => {
  it.each(['UPDATE', 'CLONE', 'DETAIL'] as const)('%s restores departamento, provincia, distrito and the zona with its options', async (mode) => {
    const { options, lookup } = fakeLookup();
    await open(mode, lookup);
    await waitFor(() => expect(levels()).toEqual(['15', '1501', '150101', '2']));
    expect(options).toHaveBeenCalledWith('zonas', { id_ubigeo: '150101' });
    expect(options).toHaveBeenCalledWith('ubigeo', { parent: '1501', has: 'zonas' });
  });

  it('DETAIL leaves every level read-only', async () => {
    const { lookup } = fakeLookup();
    await open('DETAIL', lookup);
    await waitFor(() => expect(levels()).toEqual(['15', '1501', '150101', '2']));
    expect([sel('Departamento').disabled, sel('Provincia').disabled, sel('Distrito').disabled, sel('Zona').disabled]).toEqual([true, true, true, true]);
  });

  it('prefixLen cuts the code to the level of the leaf: a longer code still restores its distrito', async () => {
    const { lookup } = fakeLookup();
    await open('UPDATE', lookup, { ...RECORD, id_ubigeo: '15010199' });
    await waitFor(() => expect(levels()).toEqual(['15', '1501', '150101', '2']));
  });

  it('a record with no ubigeo code leaves the levels empty and the zona blocked', async () => {
    const { lookup } = fakeLookup();
    await open('UPDATE', lookup, { id: '1', id_zona: '', distancia: '3' });
    expect(levels()).toEqual(['', '', '', '']);
    expect(sel('Zona').disabled).toBe(true);
  });
});

describe('a transient cascade never travels', () => {
  it('UPDATE sends the zona and the rest, but no level and not the restored ubigeo code', async () => {
    const { lookup } = fakeLookup();
    const { user, service } = await open('UPDATE', lookup);
    await waitFor(() => expect(levels()).toEqual(['15', '1501', '150101', '2']));
    await user.click(screen.getByRole('button', { name: 'Aceptar' }));
    await user.click(await screen.findByRole('button', { name: 'Confirmar' }));
    await waitFor(() => expect(service.update).toHaveBeenCalledWith('1', { id_zona: '2', distancia: 12.5 }));
  });

  it('a restored form that was not touched closes without the discard confirmation (the restore is the baseline)', async () => {
    const { lookup } = fakeLookup();
    const { user } = await open('UPDATE', lookup);
    await waitFor(() => expect(levels()).toEqual(['15', '1501', '150101', '2']));
    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(screen.queryByText(/descartar/i)).toBeNull();
  });

  it('a blank INSERT reports the first unset level, as the cascade always did', async () => {
    const { lookup } = fakeLookup();
    const { user } = await open('INSERT', lookup);
    await user.click(screen.getByRole('button', { name: 'Aceptar' }));
    expect(await screen.findByText('Departamento es obligatorio.')).toBeTruthy();
  });
});

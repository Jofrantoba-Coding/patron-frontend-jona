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
    { kind: 'select', name: 'a', label: 'Nivel A', source: { catalog: 'niveles-a' } },
    { kind: 'select', name: 'b', label: 'Nivel B', source: { catalog: 'niveles-b', where: { estado: 'true' } }, dependsOn: [{ field: 'a', filterKey: 'a' }] },
    { kind: 'select', name: 'c', label: 'Nivel C', source: { catalog: 'niveles-c' }, dependsOn: [{ field: 'b', filterKey: 'b' }] },
  ],
};
const TREE: Record<string, { id: string; name: string }[]> = {
  'niveles-a': [{ id: 'A1', name: 'UNO' }, { id: 'A2', name: 'DOS' }],
  'niveles-b': [{ id: 'B1', name: 'BE UNO' }, { id: 'B2', name: 'BE DOS' }],
  'niveles-c': [{ id: 'C1', name: 'CE UNO' }],
};
const RECORD: Row = { id: '1', a: 'A1', b: 'B2', c: 'C1' };

function fakeLookup() {
  const options = vi.fn(async (slug: string, _filters?: Record<string, string>) => TREE[slug]);
  return { options, lookup: { options } as unknown as InterLookupService };
}
async function open(mode: 'INSERT' | 'UPDATE' | 'CLONE' | 'DETAIL', lookup: InterLookupService) {
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

describe('UiCrudRegister dependent selects (R-CRUD-5 order, R-CRUD-12)', () => {
  it('INSERT: a dependent select is disabled and empty, and its options are not loaded with the form', async () => {
    const { options, lookup } = fakeLookup();
    await open('INSERT', lookup);
    expect(options).toHaveBeenCalledTimes(1);
    expect(options).toHaveBeenCalledWith('niveles-a', undefined);
    expect([sel('Nivel B').disabled, sel('Nivel C').disabled]).toEqual([true, true]);
    expect(names('Nivel B')).toEqual(['--- Seleccione ---']);
  });

  it('S-CRUD-31 choosing the parent enables and loads the next level with its filterKey and static where', async () => {
    const { options, lookup } = fakeLookup();
    const { user } = await open('INSERT', lookup);
    await user.selectOptions(sel('Nivel A'), 'UNO');
    await waitFor(() => expect(names('Nivel B')).toEqual(['--- Seleccione ---', 'BE UNO', 'BE DOS']));
    expect(options).toHaveBeenCalledWith('niveles-b', { estado: 'true', a: 'A1' });
    expect(sel('Nivel B').disabled).toBe(false);
    expect(sel('Nivel C').disabled).toBe(true);
  });

  it('S-CRUD-31 changing a level clears every level below it and reloads', async () => {
    const { options, lookup } = fakeLookup();
    const { user } = await open('UPDATE', lookup);
    await waitFor(() => expect(sel('Nivel C').value).toBe('C1'));
    await user.selectOptions(sel('Nivel A'), 'DOS');
    await waitFor(() => expect(options).toHaveBeenCalledWith('niveles-b', { estado: 'true', a: 'A2' }));
    expect(sel('Nivel B').value).toBe('');
    expect(sel('Nivel C').value).toBe('');
    expect(sel('Nivel C').disabled).toBe(true);
  });

  it.each(['UPDATE', 'CLONE'] as const)('S-CRUD-32 %s restores every level with its options loaded', async (mode) => {
    const { options, lookup } = fakeLookup();
    await open(mode, lookup);
    await waitFor(() => expect([sel('Nivel B').value, sel('Nivel C').value]).toEqual(['B2', 'C1']));
    expect(options).toHaveBeenCalledWith('niveles-b', { estado: 'true', a: 'A1' });
    expect(options).toHaveBeenCalledWith('niveles-c', { b: 'B2' });
    expect(sel('Nivel B').disabled).toBe(false);
  });

  it('S-CRUD-32 DETAIL loads the options so the saved names show, and nothing is editable', async () => {
    const { lookup } = fakeLookup();
    await open('DETAIL', lookup);
    await waitFor(() => expect(sel('Nivel C').value).toBe('C1'));
    expect([sel('Nivel A').disabled, sel('Nivel B').disabled, sel('Nivel C').disabled]).toEqual([true, true, true]);
  });

  it('the restored ids travel in the payload of an UPDATE', async () => {
    const { lookup } = fakeLookup();
    const { user, service } = await open('UPDATE', lookup);
    await waitFor(() => expect(sel('Nivel C').value).toBe('C1'));
    await user.click(screen.getByRole('button', { name: 'Aceptar' }));
    await user.click(screen.getByRole('button', { name: 'Confirmar' }));
    await waitFor(() => expect(service.update).toHaveBeenCalledWith('1', { a: 'A1', b: 'B2', c: 'C1' }));
  });
});

import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { CatalogConfig } from '../../catalogs/CatalogConfig';
import { DENY_ALL } from '../../domain/permissions';
import { ApiError } from '../../services/ApiError';
import type { InterCatalogService } from '../../services/InterCatalogService';
import { useUiCrudListImpl } from './UiCrudListImpl';

interface Row {
  id: string;
  name: string;
}
const config: CatalogConfig<Row> = {
  formId: 'f',
  title: 'Prueba',
  catalog: 'prueba',
  idKey: 'id',
  columns: [{ key: 'name', header: 'Nombre', sortable: true }],
  fields: [],
};
const makeRows = (n: number): Row[] =>
  Array.from({ length: n }, (_, i) => ({ id: String(i + 1), name: `N${String(i + 1).padStart(2, '0')}` }));

function fakeService(initial: Row[], total?: number) {
  const state = { rows: initial };
  const list = vi.fn(async () => ({
    items: state.rows,
    pagination: { page: 1, pageSize: 1000, total: total ?? state.rows.length },
  }));
  return { state, list, service: { list } as unknown as InterCatalogService<Row> };
}

async function setup(fake: ReturnType<typeof fakeService>, onAction = vi.fn()) {
  const hook = renderHook(() => useUiCrudListImpl(config, fake.service, DENY_ALL, { onAction }));
  await waitFor(() => expect(hook.result.current.status).not.toBe('loading'));
  return { ...hook, onAction };
}

describe('useUiCrudListImpl', () => {
  it('fetches once with one big page and then filters, sorts and pages on the client', async () => {
    const fake = fakeService(makeRows(25));
    const { result } = await setup(fake);

    expect(result.current.rows).toHaveLength(20);
    expect(result.current.pageCount).toBe(2);
    act(() => result.current.onPageChange(2));
    expect(result.current.rows.map((r) => r.id)).toEqual(['21', '22', '23', '24', '25']);
    act(() => result.current.onFilterChange('n03'));
    expect(result.current.rows.map((r) => r.id)).toEqual(['3']);
    expect(result.current.page).toBe(1);
    expect(fake.list).toHaveBeenCalledTimes(1);
    expect(fake.list).toHaveBeenCalledWith({ page: 1, pageSize: 1000 });
  });

  it('a header click sorts ascending then descending and goes back to page 1', async () => {
    const { result } = await setup(fakeService(makeRows(25)));

    act(() => result.current.onPageChange(2));
    act(() => result.current.onSortChange('name'));
    expect(result.current.sort).toEqual({ key: 'name', direction: 'asc' });
    expect(result.current.page).toBe(1);
    act(() => result.current.onSortChange('name'));
    expect(result.current.rows[0].id).toBe('25');
  });

  it.each([
    { startPage: 1, id: '26', expectedPage: 2 },
    { startPage: 2, id: '3', expectedPage: 1 },
  ])('keeps row $id selected after a refresh and jumps to its page $expectedPage', async ({ startPage, id, expectedPage }) => {
    const fake = fakeService(makeRows(25));
    const { result } = await setup(fake);
    act(() => result.current.onPageChange(startPage));
    fake.state.rows = makeRows(26);

    await act(() => result.current.refresh({ select: id }));

    expect(result.current.selectedId).toBe(id);
    expect(result.current.page).toBe(expectedPage);
  });

  it('keeps the selection by id on refresh while the row exists and clears it once deleted', async () => {
    const fake = fakeService(makeRows(5));
    const { result } = await setup(fake);
    act(() => result.current.onRowSelect('3'));

    await act(() => result.current.refresh());
    expect(result.current.selectedId).toBe('3');

    fake.state.rows = makeRows(5).filter((r) => r.id !== '3');
    await act(() => result.current.refresh());
    expect(result.current.selectedId).toBeUndefined();
  });

  it.each([
    { total: 1500, truncated: true },
    { total: 3, truncated: false },
  ])('flags truncation only when the server holds more rows (total $total)', async ({ total, truncated }) => {
    const { result } = await setup(fakeService(makeRows(3), total));

    expect(result.current.truncated).toBe(truncated);
  });

  it('shows the failure with its trace id and a retry loads again', async () => {
    const fake = fakeService(makeRows(2));
    fake.list.mockRejectedValueOnce(new ApiError(500, { code: 'INTERNAL', message: 'Fallo del servidor', traceId: 'T-9', details: [] }));
    const { result } = await setup(fake);

    expect(result.current.status).toBe('failed');
    expect(result.current.errorMessage).toBe('Fallo del servidor');
    expect(result.current.errorTraceId).toBe('T-9');

    await act(async () => result.current.onRetry());
    await waitFor(() => expect(result.current.status).toBe('ready'));
    expect(result.current.rows).toHaveLength(2);
  });

  it('runs the refresh action itself and hands every other action to the owner', async () => {
    const fake = fakeService(makeRows(2));
    const { result, onAction } = await setup(fake);

    await act(async () => result.current.onAction('refresh'));
    await waitFor(() => expect(fake.list).toHaveBeenCalledTimes(2));
    act(() => result.current.onAction('add'));

    expect(onAction.mock.calls).toEqual([['add']]);
  });
});

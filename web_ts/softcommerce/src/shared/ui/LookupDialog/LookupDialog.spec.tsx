import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PICKERS } from '../../../../mock-server/registry/pickers.js';
import { createAppServicesMock } from '../../../services/mock/AppServicesMock';
import { DialogStackProvider } from '../../../views/uishell/DialogStackProvider';
import { LookupDialog } from './LookupDialog';
import type { InterLookupDialog, LookupQuery } from './InterLookupDialog';

type Row = Record<string, string>;
const rowOf = (n: number, nombre: string): Row => ({ id_trabajador: String(n).padStart(3, '0'), nombre, dni: `1000${n}` });
const THREE = [rowOf(1, 'JUAN PEREZ'), rowOf(2, 'MARIA GARCIA'), rowOf(3, 'CARLOS TORRES')];

/** A fake server list: substring filters over the sent keys, then paging. */
function fakeList(rows: Row[]) {
  return vi.fn(async ({ filters, page, pageSize }: LookupQuery) => {
    const hit = rows.filter((r) => Object.entries(filters).every(([key, needle]) => !needle || (r[key] ?? '').toLowerCase().includes(needle.toLowerCase())));
    return { items: hit.slice((page - 1) * pageSize, page * pageSize), pagination: { page, pageSize, total: hit.length } };
  });
}

function mount(overrides: Partial<InterLookupDialog> = {}) {
  const props: InterLookupDialog = {
    config: PICKERS.buscarTrabajador, idKey: 'id_trabajador', list: fakeList(THREE), loadOptions: async () => [], onPick: vi.fn(), onClose: vi.fn(), ...overrides,
  };
  render(<DialogStackProvider><LookupDialog {...props} /></DialogStackProvider>);
  return props;
}
const dataRows = () => screen.getAllByRole('row').slice(1);
const selected = () => dataRows().filter((r) => r.getAttribute('aria-selected') === 'true').map((r) => r.textContent);

describe('LookupDialog (R-LKP-1..5)', () => {
  it('S-LKP-1 three rows load with none picked; pick hands the full row and closes', async () => {
    const user = userEvent.setup();
    const props = mount();
    await screen.findByText('JUAN PEREZ');
    expect(dataRows()).toHaveLength(3);
    expect(selected()).toEqual([]);
    await user.click(screen.getByText('MARIA GARCIA'));
    await user.click(screen.getByRole('button', { name: 'Agregar' }));
    expect(props.onPick).toHaveBeenCalledTimes(1);
    expect(props.onPick).toHaveBeenCalledWith(THREE[1], {});
    expect(props.onClose).toHaveBeenCalledTimes(1);
  });

  it('S-LKP-2 Esc, Cancelar and the close box close without a pick', async () => {
    const user = userEvent.setup();
    const props = mount();
    await screen.findByText('JUAN PEREZ');
    await user.keyboard('{Escape}');
    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    await user.click(screen.getByRole('button', { name: 'Close dialog' }));
    expect(props.onClose).toHaveBeenCalledTimes(3);
    expect(props.onPick).not.toHaveBeenCalled();
  });

  it('S-LKP-3 a text filter narrows the rows and selects the first; clearing restores them', async () => {
    const user = userEvent.setup();
    mount();
    await screen.findByText('JUAN PEREZ');
    await user.type(screen.getByLabelText('R. Social'), 'ma');
    await waitFor(() => expect(dataRows()).toHaveLength(1));
    expect(selected()).toEqual([expect.stringContaining('MARIA GARCIA')]);
    await user.clear(screen.getByLabelText('R. Social'));
    await waitFor(() => expect(dataRows()).toHaveLength(3));
  });

  it('S-LKP-5 a response for a superseded filter state is ignored', async () => {
    const user = userEvent.setup();
    const pending: { filters: Record<string, string>; resolve: () => void }[] = [];
    const base = fakeList(THREE);
    const list = vi.fn((query: LookupQuery) => new Promise<Awaited<ReturnType<typeof base>>>((resolve) => pending.push({ filters: query.filters, resolve: () => resolve(base(query)) })));
    mount({ list });
    await waitFor(() => expect(pending).toHaveLength(1));
    await user.type(screen.getByLabelText('R. Social'), 'ma');
    await waitFor(() => expect(pending).toHaveLength(3));
    // Latest first, then the stale ones last.
    await act(async () => { pending[2].resolve(); await Promise.resolve(); });
    await act(async () => { pending[1].resolve(); pending[0].resolve(); await Promise.resolve(); });
    expect(dataRows().map((r) => r.textContent)).toEqual([expect.stringContaining('MARIA GARCIA')]);
  });

  it('S-LKP-6 pages of 10; a filter change goes back to page 1', async () => {
    const user = userEvent.setup();
    const list = fakeList(Array.from({ length: 25 }, (_, i) => rowOf(i + 1, `TRAB ${i + 1}`)));
    mount({ list });
    await screen.findByText('TRAB 1');
    expect(dataRows()).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: 'Page 3' }));
    await waitFor(() => expect(dataRows()).toHaveLength(5));
    expect(list).toHaveBeenLastCalledWith(expect.objectContaining({ page: 3, pageSize: 10 }));
    await user.type(screen.getByLabelText('R. Social'), 'T');
    await waitFor(() => expect(list).toHaveBeenLastCalledWith(expect.objectContaining({ page: 1, filters: expect.objectContaining({ nombre: 'T' }) })));
    await waitFor(() => expect(dataRows()).toHaveLength(10));
  });

  it('S-LKP-7 the pick is disabled without a selection', async () => {
    const props = mount();
    await screen.findByText('JUAN PEREZ');
    expect((screen.getByRole('button', { name: 'Agregar' }) as HTMLButtonElement).disabled).toBe(true);
    expect(props.onPick).not.toHaveBeenCalled();
  });

  it('S-LKP-8 a double-click picks once; Enter on the selected row picks once', async () => {
    const user = userEvent.setup();
    const props = mount();
    await screen.findByText('JUAN PEREZ');
    await user.dblClick(screen.getByText('JUAN PEREZ'));
    expect(props.onPick).toHaveBeenCalledTimes(1);
    expect(props.onPick).toHaveBeenCalledWith(THREE[0], {});
    await user.click(screen.getByText('CARLOS TORRES'));
    screen.getByRole('group', { name: 'Resultados' }).focus();
    await user.keyboard('{Enter}');
    expect(props.onPick).toHaveBeenCalledTimes(2);
    expect(props.onPick).toHaveBeenLastCalledWith(THREE[2], {});
  });

  it('R-LKP-4 Enter in a filter moves to the next one, then to the results, or to Cancelar when empty', async () => {
    const user = userEvent.setup();
    mount();
    await screen.findByText('JUAN PEREZ');
    await user.click(screen.getByLabelText('Código'));
    await user.keyboard('{Enter}');
    expect(document.activeElement).toBe(screen.getByLabelText('R. Social'));
    await user.keyboard('{Enter}');
    expect(document.activeElement).toBe(screen.getByLabelText('RUC/DNI'));
    await user.keyboard('{Enter}');
    expect(document.activeElement).toBe(screen.getByRole('group', { name: 'Resultados' }));
    await user.click(screen.getByLabelText('R. Social'));
    await user.type(screen.getByLabelText('R. Social'), 'ZZZ');
    await screen.findByText('No se encontraron registros.');
    await user.click(screen.getByLabelText('RUC/DNI'));
    await user.keyboard('{Enter}');
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Cancelar' }));
  });

  it('S-LKP-12 shows loading, empty, and an error with retry; Refrescar clears the filters', async () => {
    const user = userEvent.setup();
    const base = fakeList(THREE);
    let fail = true;
    let release: () => void = () => undefined;
    const list = vi.fn(async (query: LookupQuery) => {
      if (fail) throw new Error('boom');
      await new Promise<void>((resolve) => (release = resolve));
      return base(query);
    });
    mount({ list });
    await screen.findByRole('alert');
    fail = false;
    await user.click(screen.getByRole('button', { name: 'Reintentar' }));
    await screen.findByText('Cargando...');
    await act(async () => release());
    await screen.findByText('JUAN PEREZ');
    await user.type(screen.getByLabelText('R. Social'), 'x');
    await act(async () => release());
    await user.click(screen.getByRole('button', { name: 'Refrescar' }));
    await act(async () => release());
    expect((screen.getByLabelText('R. Social') as HTMLInputElement).value).toBe('');
    expect(list).toHaveBeenLastCalledWith(expect.objectContaining({ page: 1, filters: {} }));
  });

  it('S-LKP-15 an inactive trabajador is never listed (real mock list)', async () => {
    const services = createAppServicesMock('exitoso', { getSession: () => ({ tenantId: 'demo' }), delayMs: 0 });
    const service = services.catalog<Row>('trabajadores');
    mount({ list: ({ filters, page, pageSize }) => service.list({ page, pageSize, filters }) });
    await screen.findByText('JUAN PEREZ LOPEZ');
    expect(dataRows()).toHaveLength(3);
    expect(screen.queryByText('LUIS RETIRADO SOTO')).toBeNull();
  });
});

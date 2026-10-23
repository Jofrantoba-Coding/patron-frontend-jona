import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DependentSelect } from './DependentSelect';
import type { InterDependentSelect } from './InterDependentSelect';

const FAMILIA = [{ field: 'id_familia', filterKey: 'id_familia' }];
const BOTH = [...FAMILIA, { field: 'id_tipo', filterKey: 'id_tipo' }];
const ITEMS = [{ id: '5010', name: 'FRUTAS' }, { id: '5011', name: 'VERDURAS' }];
const base = { name: 'id_subfamilia_sunat', label: 'Codigo Sunat', parents: FAMILIA, onChange: vi.fn() };
const select = () => screen.getByLabelText('Codigo Sunat') as HTMLSelectElement;
const names = () => [...select().options].map((o) => o.textContent);
const view = (props: Partial<InterDependentSelect> & Pick<InterDependentSelect, 'values' | 'load'>) => <DependentSelect {...base} {...props} />;

// R-CRUD-12 / S-CRUD-31, 32, 40: a select whose options depend on the values of other fields.
describe('DependentSelect (G2)', () => {
  it('stays disabled and empty until its parent is set, without asking the lookup', () => {
    const load = vi.fn(async () => ITEMS);
    render(view({ values: { id_familia: '' }, load }));
    expect(select().disabled).toBe(true);
    expect(names()).toEqual(['--- Seleccione ---']);
    expect(load).not.toHaveBeenCalled();
  });

  it('loads with the parent value under its filterKey once the parent is set, and enables', async () => {
    const load = vi.fn(async (_filters: Record<string, string>) => ITEMS);
    const { rerender } = render(view({ values: { id_familia: '' }, load }));
    rerender(view({ values: { id_familia: '001' }, load }));
    await waitFor(() => expect(names()).toEqual(['--- Seleccione ---', 'FRUTAS', 'VERDURAS']));
    expect(load).toHaveBeenCalledWith({ id_familia: '001' });
    expect(select().disabled).toBe(false);
  });

  it('S-CRUD-40 waits for every parent and sends both filterKeys', async () => {
    const load = vi.fn(async (_filters: Record<string, string>) => ITEMS);
    const { rerender } = render(view({ parents: BOTH, values: { id_familia: '001', id_tipo: '' }, load }));
    expect(select().disabled).toBe(true);
    expect(load).not.toHaveBeenCalled();
    rerender(view({ parents: BOTH, values: { id_familia: '001', id_tipo: 'A' }, load }));
    await waitFor(() => expect(load).toHaveBeenCalledWith({ id_familia: '001', id_tipo: 'A' }));
    rerender(view({ parents: BOTH, values: { id_familia: '002', id_tipo: 'A' }, load }));
    await waitFor(() => expect(load).toHaveBeenLastCalledWith({ id_familia: '002', id_tipo: 'A' }));
  });

  it('S-CRUD-32 UPDATE restores the saved value with its options loaded', async () => {
    render(view({ values: { id_familia: '001', id_subfamilia_sunat: '5011' }, load: async () => ITEMS }));
    await waitFor(() => expect(select().value).toBe('5011'));
  });

  it('S-CRUD-32 DETAIL and DELETE load the options but keep the select read-only', async () => {
    const load = vi.fn(async () => ITEMS);
    render(view({ values: { id_familia: '001', id_subfamilia_sunat: '5010' }, load, readOnly: true }));
    await waitFor(() => expect(names()).toContain('FRUTAS'));
    expect(select().disabled).toBe(true);
    expect(select().value).toBe('5010');
  });

  it('S-CRUD-32 shows only the latest parent\'s options when an older response arrives late', async () => {
    const pending: ((items: typeof ITEMS) => void)[] = [];
    const load = vi.fn(() => new Promise<typeof ITEMS>((resolve) => pending.push(resolve)));
    const { rerender } = render(view({ values: { id_familia: '001' }, load }));
    rerender(view({ values: { id_familia: '002' }, load }));
    pending[1]([{ id: '9', name: 'NUEVA' }]);
    await waitFor(() => expect(names()).toContain('NUEVA'));
    pending[0](ITEMS);
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(names()).toEqual(['--- Seleccione ---', 'NUEVA']);
  });

  it('reports the chosen id first, without the DOM event', async () => {
    const onChange = vi.fn();
    render(view({ values: { id_familia: '001' }, load: async () => ITEMS, onChange }));
    await waitFor(() => expect(names()).toContain('FRUTAS'));
    await userEvent.setup().selectOptions(select(), 'VERDURAS');
    expect(onChange).toHaveBeenCalledWith('5011');
    expect(onChange.mock.calls[0]).toHaveLength(1);
  });

  it('S-CRUD-20 a failed load disables the select, says so and retries on demand', async () => {
    const load = vi.fn().mockRejectedValueOnce(new Error('x')).mockResolvedValue(ITEMS);
    render(view({ values: { id_familia: '001' }, load }));
    await waitFor(() => expect(screen.getByRole('alert')).toBeTruthy());
    expect(select().disabled).toBe(true);
    await userEvent.setup().click(screen.getByRole('button', { name: 'Reintentar' }));
    await waitFor(() => expect(names()).toContain('FRUTAS'));
    expect(select().disabled).toBe(false);
  });

  it('keeps the 44px touch floor below sm: and compacts from sm: up, and forwards its ref', () => {
    const ref = { current: null as HTMLSelectElement | null };
    render(<DependentSelect {...base} values={{}} load={async () => ITEMS} ref={ref} />);
    expect(select().className).toContain('min-h-11');
    expect(select().className).toContain('sm:min-h-9');
    expect(ref.current).toBe(select());
  });
});

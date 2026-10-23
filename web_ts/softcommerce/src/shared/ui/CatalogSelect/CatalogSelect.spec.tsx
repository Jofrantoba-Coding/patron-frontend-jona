import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CatalogSelect } from './CatalogSelect';

const ITEMS = [{ id: '1', name: 'PORCENTAJE' }, { id: '2', name: 'MONTO' }];
const base = { name: 'id_tipo_descuento', label: 'Tipo Dscto', options: ITEMS, onChange: vi.fn() };
const select = () => screen.getByLabelText('Tipo Dscto') as HTMLSelectElement;

// G1 / S-CRUD-29: a select over a catalog lookup; the payload carries the id, the list shows the names.
describe('CatalogSelect (G1)', () => {
  it('lists the lookup names after the desktop placeholder, and shows the chosen one', () => {
    const { rerender } = render(<CatalogSelect {...base} value="" />);
    expect([...select().options].map((o) => o.textContent)).toEqual(['--- Seleccione ---', 'PORCENTAJE', 'MONTO']);
    rerender(<CatalogSelect {...base} value="2" />);
    expect(select().value).toBe('2');
  });

  it('reports the chosen id first, without the DOM event', async () => {
    const onChange = vi.fn();
    render(<CatalogSelect {...base} value="" onChange={onChange} />);

    await userEvent.setup().selectOptions(select(), 'MONTO');

    expect(onChange).toHaveBeenCalledWith('2');
    expect(onChange.mock.calls[0]).toHaveLength(1);
  });

  it('a read-only select is disabled', () => {
    render(<CatalogSelect {...base} value="1" readOnly />);
    expect(select().disabled).toBe(true);
  });

  it('an empty lookup leaves only the placeholder', () => {
    render(<CatalogSelect {...base} options={[]} value="" />);
    expect([...select().options].map((o) => o.textContent)).toEqual(['--- Seleccione ---']);
  });

  it('keeps the 44px touch floor below sm: and compacts from sm: up', () => {
    render(<CatalogSelect {...base} value="" />);
    expect(select().className).toContain('min-h-11');
    expect(select().className).toContain('sm:min-h-9');
  });

  it('forwards the ref to the select so a blocked submit can focus it', () => {
    const ref = { current: null as HTMLSelectElement | null };
    render(<CatalogSelect {...base} value="" ref={ref} />);
    expect(ref.current).toBe(select());
  });
});

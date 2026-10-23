import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { OptionsField } from './OptionsField';

const OPTIONS = [{ value: 'E', label: 'Entrada' }, { value: 'S', label: 'Salida' }];
const base = { name: 'tipo', label: 'Tipo de Movimiento', options: OPTIONS, onChange: vi.fn() };

describe('OptionsField as a select (G7)', () => {
  it('lists the labels, shows the chosen one and a placeholder while empty', () => {
    const { rerender } = render(<OptionsField {...base} display="select" value="" />);
    const select = screen.getByLabelText('Tipo de Movimiento') as HTMLSelectElement;
    expect([...select.options].map((o) => o.textContent)).toEqual(['Seleccione', 'Entrada', 'Salida']);
    rerender(<OptionsField {...base} display="select" value="S" />);
    expect(select.value).toBe('S');
  });

  it('reports the option code first, without the DOM event', async () => {
    const onChange = vi.fn();
    render(<OptionsField {...base} display="select" value="" onChange={onChange} />);

    await userEvent.setup().selectOptions(screen.getByLabelText('Tipo de Movimiento'), 'Entrada');

    expect(onChange).toHaveBeenCalledWith('E');
    expect(onChange.mock.calls[0]).toHaveLength(1);
  });

  it('a read-only select is disabled', () => {
    render(<OptionsField {...base} display="select" value="E" readOnly />);
    expect((screen.getByLabelText('Tipo de Movimiento') as HTMLSelectElement).disabled).toBe(true);
  });
});

describe('OptionsField as radios (G7)', () => {
  it('is a radio group named by the label, with no option chosen while empty', () => {
    render(<OptionsField {...base} display="radio" value="" />);
    expect(screen.getByRole('radiogroup', { name: 'Tipo de Movimiento' })).toBeTruthy();
    expect((screen.getByRole('radio', { name: 'Entrada' }) as HTMLInputElement).checked).toBe(false);
    expect((screen.getByRole('radio', { name: 'Salida' }) as HTMLInputElement).checked).toBe(false);
  });

  it('checks the option of the value and reports the code of the clicked one', async () => {
    const onChange = vi.fn();
    render(<OptionsField {...base} display="radio" value="E" onChange={onChange} />);
    expect((screen.getByRole('radio', { name: 'Entrada' }) as HTMLInputElement).checked).toBe(true);

    await userEvent.setup().click(screen.getByRole('radio', { name: 'Salida' }));

    expect(onChange).toHaveBeenCalledWith('S');
  });

  it('read-only radios cannot be changed', async () => {
    const onChange = vi.fn();
    render(<OptionsField {...base} display="radio" value="E" readOnly onChange={onChange} />);
    await userEvent.setup().click(screen.getByRole('radio', { name: 'Salida' }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('forwards the ref to the first radio so a blocked submit can focus the group', () => {
    const ref = { current: null as HTMLElement | null };
    render(<OptionsField {...base} display="radio" value="" ref={ref} />);
    expect(ref.current).toBe(screen.getByRole('radio', { name: 'Entrada' }));
  });
});

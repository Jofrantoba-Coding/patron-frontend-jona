import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { DateField } from './DateField';

function Harness({ initial = '' }: { initial?: string }) {
  const [value, setValue] = useState(initial);
  return <DateField name="fecha" label="Fecha" value={value} onChange={setValue} />;
}
const input = () => screen.getByLabelText('Fecha') as HTMLInputElement;

describe('DateField (S-CRUD-27: masked dd/MM/yyyy over jona-ui JDatePicker)', () => {
  it('masks typed digits as dd/MM/yyyy', async () => {
    render(<Harness />);
    await userEvent.type(input(), '15012026');
    expect(input().value).toBe('15/01/2026');
  });

  it('shows a given value as it is and hints the format', () => {
    render(<Harness initial="05/12/1999" />);
    expect(input().value).toBe('05/12/1999');
    expect(input().placeholder).toBe('dd/MM/yyyy');
  });

  it('reports the value first, with no DOM event', async () => {
    const onChange = vi.fn();
    render(<DateField name="fecha" label="Fecha" value="" onChange={onChange} />);
    await userEvent.type(input(), '1');
    expect(onChange).toHaveBeenCalledWith('1');
    expect(onChange.mock.calls[0]).toHaveLength(1);
  });

  it('a calendar day picked reports the masked date', async () => {
    const onChange = vi.fn();
    render(<DateField name="fecha" label="Fecha" value="15/01/2026" onChange={onChange} />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Abrir calendario' }));
    await user.click(screen.getByRole('button', { name: /20 de enero de 2026/ }));
    expect(onChange).toHaveBeenLastCalledWith('20/01/2026');
  });

  it('marks an error on the input and keeps the 44px mobile floor', () => {
    const { rerender } = render(<DateField name="fecha" label="Fecha" value="" hasError onChange={vi.fn()} />);
    expect(input().getAttribute('aria-invalid')).toBe('true');
    expect(input().closest('div.relative')!.classList.contains('min-h-11')).toBe(true);
    expect(input().closest('div.relative')!.classList.contains('sm:min-h-9')).toBe(true);
    rerender(<DateField name="fecha" label="Fecha" value="" onChange={vi.fn()} />);
    expect(input().getAttribute('aria-invalid')).toBeNull();
  });

  it('points the input at the element that describes its error, and drops the link without one', () => {
    const { rerender } = render(<DateField name="fecha" label="Fecha" value="" hasError describedBy="fecha-error" onChange={vi.fn()} />);
    expect(input().getAttribute('aria-describedby')).toBe('fecha-error');
    rerender(<DateField name="fecha" label="Fecha" value="" onChange={vi.fn()} />);
    expect(input().getAttribute('aria-describedby')).toBeNull();
  });

  it('a read-only date is disabled and cannot be edited or opened', async () => {
    const onChange = vi.fn();
    render(<DateField name="fecha" label="Fecha" value="15/01/2026" readOnly onChange={onChange} />);
    expect(input().disabled).toBe(true);
    expect((screen.getByRole('button', { name: 'Abrir calendario' }) as HTMLButtonElement).disabled).toBe(true);
    await userEvent.setup().type(input(), '1');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('forwards the ref to the input so a blocked submit can focus it', () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<DateField name="fecha" label="Fecha" value="" ref={ref} onChange={vi.fn()} />);
    expect(ref.current).toBe(input());
  });
});

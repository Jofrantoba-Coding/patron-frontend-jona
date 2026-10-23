import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { NumberField } from './NumberField';

function Harness({ initial = '', max = 2, onBlur }: { initial?: string; max?: number; onBlur?: (value: string) => void }) {
  const [value, setValue] = useState(initial);
  return <NumberField name="hora" label="Hora" value={value} max={max} onChange={setValue} onBlur={onBlur} />;
}
const input = () => screen.getByLabelText('Hora') as HTMLInputElement;

describe('NumberField with scale 0 (S-CRUD-25 integer half)', () => {
  it('ignores a digit past max and keeps the value', async () => {
    render(<Harness />);
    await userEvent.type(input(), '123');
    expect(input().value).toBe('12');
  });

  it('ignores letters and symbols while typing', async () => {
    render(<Harness />);
    await userEvent.type(input(), 'a1b-2.c');
    expect(input().value).toBe('12');
  });

  it('keeps only the digits of a paste, and ignores a paste that would overflow, whole', async () => {
    render(<Harness />);
    input().focus();
    await userEvent.paste('x7y');
    expect(input().value).toBe('7');
    await userEvent.paste('99');
    expect(input().value).toBe('7');
  });

  it('accepts a paste over a selection when the result fits max', async () => {
    render(<Harness initial="12" />);
    input().focus();
    input().setSelectionRange(0, 2);
    await userEvent.paste('34');
    expect(input().value).toBe('34');
  });

  it('reports the value first, without the DOM event, and the value on blur', async () => {
    const onChange = vi.fn();
    const onBlur = vi.fn();
    render(<NumberField name="hora" label="Hora" value="" max={2} onChange={onChange} onBlur={onBlur} />);
    const user = userEvent.setup();

    await user.type(input(), '5');
    expect(onChange).toHaveBeenCalledWith('5');
    expect(onChange.mock.calls[0]).toHaveLength(1);

    await user.tab();
    expect(onBlur).toHaveBeenCalledTimes(1);
    expect(onBlur.mock.calls[0]).toHaveLength(1);
  });

  it('shows a stored value as it is, so a padded 05 stays 05', () => {
    render(<Harness initial="05" />);
    expect(input().value).toBe('05');
  });

  it('is a numeric keypad input with the 44px mobile floor, and marks an error', () => {
    render(<NumberField name="hora" label="Hora" value="" max={2} hasError onChange={vi.fn()} />);
    expect(input().inputMode).toBe('numeric');
    expect(input().getAttribute('aria-invalid')).toBe('true');
    expect(input().classList.contains('min-h-11')).toBe(true);
    expect(input().classList.contains('sm:min-h-9')).toBe(true);
  });

  it('a read-only field cannot be edited', async () => {
    const onChange = vi.fn();
    render(<NumberField name="hora" label="Hora" value="05" max={2} readOnly onChange={onChange} />);
    await userEvent.setup().type(input(), '1');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('forwards the ref to the input so a blocked submit can focus it', () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<NumberField name="hora" label="Hora" value="" max={2} ref={ref} onChange={vi.fn()} />);
    expect(ref.current).toBe(input());
  });
});

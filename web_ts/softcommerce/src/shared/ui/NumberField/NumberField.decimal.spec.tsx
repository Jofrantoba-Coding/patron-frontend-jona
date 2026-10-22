import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { NumberField } from './NumberField';

function Decimal({ initial = '', onBlur }: { initial?: string; onBlur?: (value: string) => void }) {
  const [value, setValue] = useState(initial);
  return <NumberField name="monto" label="Monto" value={value} scale={2} onChange={setValue} onBlur={onBlur} />;
}
const amount = () => screen.getByLabelText('Monto') as HTMLInputElement;

describe('NumberField with scale > 0 (S-CRUD-25 decimal half)', () => {
  it('is a decimal keypad input with the 44px mobile floor', () => {
    render(<Decimal />);
    expect(amount().inputMode).toBe('decimal');
    expect(amount().classList.contains('min-h-11')).toBe(true);
    expect(amount().classList.contains('sm:min-h-9')).toBe(true);
  });

  it('accepts a decimal point and any number of decimals (no precision limit)', async () => {
    render(<Decimal />);
    await userEvent.type(amount(), '3.14159');
    expect(amount().value).toBe('3.14159');
  });

  it('ignores a second decimal point and letters', async () => {
    render(<Decimal />);
    await userEvent.type(amount(), '1.5.2a');
    expect(amount().value).toBe('1.52');
  });

  it('ignores a pasted value that does not match the pattern, whole', async () => {
    render(<Decimal initial="7" />);
    amount().focus();
    await userEvent.paste('1.5.2');
    expect(amount().value).toBe('7');
    await userEvent.paste('abc');
    expect(amount().value).toBe('7');
  });

  it('accepts a minus sign and a partial number; the submit rules judge them later', async () => {
    render(<Decimal />);
    await userEvent.type(amount(), '-3');
    expect(amount().value).toBe('-3');
    await userEvent.clear(amount());
    await userEvent.type(amount(), '.');
    expect(amount().value).toBe('.');
  });

  it('accepts a minus only at the start', async () => {
    render(<Decimal initial="5" />);
    await userEvent.type(amount(), '-');
    expect(amount().value).toBe('5');
  });

  it('shows a stored value as it is: no rounding, trailing zero kept', () => {
    render(<Decimal initial="1.50" />);
    expect(amount().value).toBe('1.50');
  });

  it('reports the value on blur', async () => {
    const onBlur = vi.fn();
    render(<Decimal onBlur={onBlur} />);
    const user = userEvent.setup();
    await user.type(amount(), '2');
    await user.tab();
    expect(onBlur).toHaveBeenCalledTimes(1);
    expect(onBlur.mock.calls[0]).toHaveLength(1);
  });

  it('a read-only decimal cannot be edited', async () => {
    const onChange = vi.fn();
    render(<NumberField name="monto" label="Monto" value="1.5" scale={2} readOnly onChange={onChange} />);
    await userEvent.setup().type(amount(), '1');
    expect(onChange).not.toHaveBeenCalled();
  });
});

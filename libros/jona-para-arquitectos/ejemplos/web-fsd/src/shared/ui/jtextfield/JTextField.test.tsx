import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { JTextField } from './index';
import { JTEXTFIELD_DEFAULTS } from './InterJTextField';

const input = () => screen.getByLabelText('Correo') as HTMLInputElement;

describe('JTextField (átomo; forma mínima, variante b)', () => {
  it('aplica JTEXTFIELD_DEFAULTS cuando nadie indica valores', () => {
    render(<JTextField label="Correo" value="" />);

    expect(input().type).toBe(JTEXTFIELD_DEFAULTS.type);
    expect(input().disabled).toBe(JTEXTFIELD_DEFAULTS.disabled);
  });

  it('entrega el valor, no el evento del DOM, en onChange', () => {
    const onChange = vi.fn();
    render(<JTextField label="Correo" value="" type="email" onChange={onChange} />);

    fireEvent.change(input(), { target: { value: 'ana@ejemplo.com' } });

    expect(input().type).toBe('email');
    expect(onChange).toHaveBeenCalledWith('ana@ejemplo.com');
  });
});

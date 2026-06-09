import { render, screen, fireEvent } from '@testing-library/react';
import { JDatePicker } from '../JDatePicker';

describe('JDatePicker', () => {
  it('keeps the default yyyy-MM-dd behavior while allowing text input', () => {
    const onChange = vi.fn();
    render(<JDatePicker onChange={onChange} />);

    const input = screen.getByRole('textbox', { name: 'Seleccionar fecha' }) as HTMLInputElement;
    fireEvent.change(input, { target: { value: '20260509' } });

    expect(input.value).toBe('2026-05-09');
    expect(onChange).toHaveBeenLastCalledWith('2026-05-09');
  });

  it('accepts a custom date-time mask with seconds and timezone', () => {
    const onChange = vi.fn();
    render(
      <JDatePicker
        mask="dd/MM/yyyy HH:mm:ss z"
        showTime
        showSeconds
        timezone="America/Lima"
        onChange={onChange}
      />
    );

    const input = screen.getByRole('textbox', { name: 'Seleccionar fecha' }) as HTMLInputElement;
    fireEvent.change(input, { target: { value: '10052026143045America/Lima' } });

    expect(input.value).toBe('10/05/2026 14:30:45 America/Lima');
    expect(onChange).toHaveBeenLastCalledWith('10/05/2026 14:30:45 America/Lima');
  });

  it('formats calendar selections with the configured mask', () => {
    const onChange = vi.fn();
    render(
      <JDatePicker
        value="09/05/2026 14:30:45 America/Lima"
        mask="dd/MM/yyyy HH:mm:ss z"
        showTime
        showSeconds
        timezone="America/Lima"
        onChange={onChange}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Abrir calendario' }));
    fireEvent.click(screen.getByRole('button', { name: /10 de mayo de 2026/i }));

    expect(onChange).toHaveBeenLastCalledWith('10/05/2026 14:30:45 America/Lima');
  });
});

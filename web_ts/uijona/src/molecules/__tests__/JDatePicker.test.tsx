import { render, screen, fireEvent } from '@testing-library/react';
import { createRef, useState } from 'react';
import { vi } from 'vitest';
import { JDatePicker } from '../JDatePicker';
import { JField } from '../JField';
import { seriousViolations } from '../../__tests__/quality/axe';

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

describe('JDatePicker label, error and ref (R-FRM-6)', () => {
  it('S-FRM-12: the label names the text input', () => {
    render(<JDatePicker label="Desde" />);

    const input = screen.getByLabelText('Desde');
    expect(input.tagName).toBe('INPUT');
    expect(input).toBe(screen.getByRole('textbox', { name: 'Desde' }));
    expect(screen.getByRole('button', { name: 'Abrir calendario' })).toBeInTheDocument();
  });

  it('S-FRM-12: passes id, name and required to the text input', () => {
    render(<JDatePicker label="Hasta" id="hasta" name="hasta" required />);

    const input = screen.getByRole('textbox', { name: 'Hasta' });
    expect(input).toHaveAttribute('id', 'hasta');
    expect(input).toHaveAttribute('name', 'hasta');
    expect(input).toBeRequired();
  });

  it('S-FRM-13: an error marks the input invalid and describes it, without an alert', () => {
    const { rerender } = render(<JDatePicker label="Desde" error="Fecha inválida" />);
    const input = screen.getByRole('textbox', { name: 'Desde' });

    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Fecha inválida');
    expect(screen.queryByRole('alert')).toBeNull();

    rerender(<JDatePicker label="Desde" />);

    expect(input).not.toHaveAttribute('aria-invalid');
    expect(screen.queryByText('Fecha inválida')).toBeNull();
  });

  it('S-FRM-13: keeps an external description before its own error', () => {
    render(
      <>
        <p id="ayuda">Formato dd/MM/yyyy</p>
        <JDatePicker label="Desde" aria-describedby="ayuda" error="Fecha inválida" />
      </>,
    );

    expect(screen.getByRole('textbox', { name: 'Desde' })).toHaveAccessibleDescription('Formato dd/MM/yyyy Fecha inválida');
  });

  it('R-FRM-6: takes its name and wiring from a JField', () => {
    render(
      <JField id="desde" label="Desde" description="Formato dd/MM/yyyy" error="Fecha inválida">
        {(aria) => (
          <JDatePicker id={aria.id} aria-describedby={aria['aria-describedby']} aria-invalid={aria['aria-invalid']} />
        )}
      </JField>,
    );

    const input = screen.getByRole('textbox', { name: 'Desde' });
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Formato dd/MM/yyyy Fecha inválida');
  });

  it('S-FRM-14: forwards the ref to the text input', () => {
    const ref = createRef<HTMLInputElement>();
    render(<JDatePicker ref={ref} label="Desde" />);

    expect(ref.current).toBe(screen.getByRole('textbox', { name: 'Desde' }));
    ref.current!.focus();
    expect(ref.current).toHaveFocus();
  });

  it('S-FRM-15: shows an ISO value as dd/MM/yyyy and reports a typed date as ISO', () => {
    const onChange = vi.fn();
    render(<JDatePicker label="Desde" mask="dd/MM/yyyy" valueFormat="iso" value="2026-01-15" onChange={onChange} />);
    const input = screen.getByRole('textbox', { name: 'Desde' }) as HTMLInputElement;

    expect(input.value).toBe('15/01/2026');

    fireEvent.change(input, { target: { value: '01/02/2026' } });

    expect(onChange).toHaveBeenLastCalledWith('2026-02-01');
  });

  it('S-FRM-15: reports an incomplete entry as typed and keeps a controlled round trip', () => {
    const onChange = vi.fn();
    const Controlled = () => {
      const [value, setValue] = useState('');
      return (
        <JDatePicker
          label="Desde"
          mask="dd/MM/yyyy"
          valueFormat="iso"
          value={value}
          onChange={(next) => { onChange(next); setValue(next); }}
        />
      );
    };
    render(<Controlled />);
    const input = screen.getByRole('textbox', { name: 'Desde' }) as HTMLInputElement;

    fireEvent.change(input, { target: { value: '0102' } });

    expect(onChange).toHaveBeenLastCalledWith('01/02');
    expect(input.value).toBe('01/02');

    fireEvent.change(input, { target: { value: '01022026' } });

    expect(onChange).toHaveBeenLastCalledWith('2026-02-01');
    expect(input.value).toBe('01/02/2026');
  });

  it('S-FRM-15: a calendar pick in the recipe is reported as ISO and shown masked', () => {
    const onChange = vi.fn();
    render(<JDatePicker label="Desde" mask="dd/MM/yyyy" valueFormat="iso" value="2026-01-15" onChange={onChange} />);

    fireEvent.click(screen.getByRole('button', { name: 'Abrir calendario' }));
    fireEvent.click(screen.getByRole('button', { name: /20 de enero de 2026/i }));

    expect(onChange).toHaveBeenLastCalledWith('2026-01-20');
    expect((screen.getByRole('textbox', { name: 'Desde' }) as HTMLInputElement).value).toBe('20/01/2026');
  });

  it('R-FRM-6: onBlur reports the value first, in the value format', () => {
    const onBlur = vi.fn();
    const { rerender } = render(<JDatePicker label="Desde" mask="dd/MM/yyyy" valueFormat="iso" onBlur={onBlur} />);
    const input = screen.getByRole('textbox', { name: 'Desde' });

    fireEvent.change(input, { target: { value: '10052026' } });
    fireEvent.blur(input);

    expect(onBlur).toHaveBeenLastCalledWith('2026-05-10');

    rerender(<JDatePicker label="Desde" mask="dd/MM/yyyy" onBlur={onBlur} />);
    fireEvent.blur(input);

    expect(onBlur).toHaveBeenLastCalledWith('10/05/2026');
  });

  it('has no serious axe violations with a label and an error', async () => {
    const { container } = render(<JDatePicker label="Desde" error="Fecha inválida" required />);

    expect(await seriousViolations(container)).toEqual([]);
  });
});

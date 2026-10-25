import { fireEvent, render, screen, within } from '@testing-library/react';
import { vi } from 'vitest';
import { JErrorSummary } from '../JErrorSummary';
import { seriousViolations } from '../../__tests__/quality/axe';

const ERRORS = [
  { field: 'usuario', label: 'Usuario', message: 'Ingrese Usuario' },
  { field: 'clave', label: 'Clave', message: 'Ingrese Clave' },
];

describe('JErrorSummary (R-FRM-4)', () => {
  it('S-FRM-7: renders nothing when the list is empty', () => {
    const { container } = render(<JErrorSummary errors={[]} />);

    expect(screen.queryByRole('alert')).toBeNull();
    expect(container).toBeEmptyDOMElement();
  });

  it('S-FRM-8: one alert lists a button per error, in order, and selects by field', () => {
    const onSelect = vi.fn();
    render(<JErrorSummary errors={ERRORS} onSelect={onSelect} />);

    const alerts = screen.getAllByRole('alert');
    expect(alerts).toHaveLength(1);
    expect(within(alerts[0]).getByText('Revise los campos marcados')).toBeInTheDocument();
    const buttons = within(alerts[0]).getAllByRole('button');
    expect(buttons.map((button) => button.textContent)).toEqual(['Usuario: Ingrese Usuario', 'Clave: Ingrese Clave']);

    fireEvent.click(buttons[1]);

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith('clave');
  });

  it('S-FRM-8: takes a custom title and selects the first field', () => {
    const onSelect = vi.fn();
    render(<JErrorSummary title="Hay 2 errores" errors={ERRORS} onSelect={onSelect} />);

    expect(within(screen.getByRole('alert')).getByText('Hay 2 errores')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Usuario: Ingrese Usuario' }));

    expect(onSelect).toHaveBeenCalledWith('usuario');
  });

  it('S-FRM-9: appearing does not move focus away from the submit button', () => {
    const form = (errors: typeof ERRORS) => (
      <form>
        <JErrorSummary errors={errors} />
        <button type="submit">Guardar</button>
      </form>
    );
    const { rerender } = render(form([]));
    const submit = screen.getByRole('button', { name: 'Guardar' });
    submit.focus();

    rerender(form(ERRORS));

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(submit).toHaveFocus();
  });

  it('has no serious axe violations', async () => {
    const { container } = render(<JErrorSummary errors={ERRORS} onSelect={() => undefined} />);

    expect(await seriousViolations(container)).toEqual([]);
  });
});

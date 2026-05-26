import { render, screen, fireEvent, act } from '@testing-library/react';
import { JTimer } from '../JTimer';

describe('JTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders a configurable countdown and completes at zero', () => {
    const onComplete = vi.fn();
    const onChange   = vi.fn();

    render(
      <JTimer
        durationMs={2000}
        tickIntervalMs={1000}
        onComplete={onComplete}
        onChange={onChange}
      />
    );

    expect(screen.getByLabelText('Timer')).toHaveTextContent('00:00:02');

    fireEvent.click(screen.getByRole('button', { name: 'Iniciar' }));

    act(() => { vi.advanceTimersByTime(2000); });

    expect(screen.getByLabelText('Timer')).toHaveTextContent('00:00:00');
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith(0, 'completed');
  });

  it('can run as a stopwatch with milliseconds', () => {
    render(
      <JTimer
        mode="stopwatch"
        tickIntervalMs={100}
        showHours={false}
        showMilliseconds
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Iniciar' }));

    act(() => { vi.advanceTimersByTime(350); });

    expect(screen.getByLabelText('Timer').textContent).toMatch(/^00:00\.[3-4]\d{2}$/);
  });

  it('supports pause, resume and reset callbacks', () => {
    const onPause  = vi.fn();
    const onResume = vi.fn();
    const onReset  = vi.fn();

    render(
      <JTimer
        mode="stopwatch"
        defaultValueMs={1000}
        onPause={onPause}
        onResume={onResume}
        onReset={onReset}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Iniciar' }));
    fireEvent.click(screen.getByRole('button', { name: 'Pausar' }));
    expect(onPause).toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }));
    expect(onResume).toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Reiniciar' }));
    expect(onReset).toHaveBeenCalledWith(1000);
    expect(screen.getByLabelText('Timer')).toHaveTextContent('00:00:01');
  });
});

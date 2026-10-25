import { render, screen, fireEvent } from '@testing-library/react';
import { JButton } from '../JButton';

describe('JButton', () => {
  it('renders children', () => {
    render(<JButton>Click me</JButton>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<JButton onClick={onClick}>Click</JButton>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<JButton disabled>Click</JButton>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('is disabled and shows spinner when loading', () => {
    render(<JButton loading>Click</JButton>);
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('does not call onClick when disabled', () => {
    const onClick = vi.fn();
    render(<JButton disabled onClick={onClick}>Click</JButton>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('applies fullWidth class', () => {
    render(<JButton fullWidth>Click</JButton>);
    expect(screen.getByRole('button')).toHaveClass('w-full');
  });
});

describe('JButton accessibility props (S-FND-17)', () => {
  it('passes the shortcut, title and description attributes to the native button', () => {
    render(<JButton title="Agregar (Alt+A)" aria-keyshortcuts="Alt+A" aria-describedby="r1">Agregar</JButton>);
    const button = screen.getByRole('button', { name: 'Agregar' });

    expect(button).toHaveAttribute('title', 'Agregar (Alt+A)');
    expect(button).toHaveAttribute('aria-keyshortcuts', 'Alt+A');
    expect(button).toHaveAttribute('aria-describedby', 'r1');
  });

  it('passes the id, label, pressed, expanded, controls and haspopup attributes', () => {
    render(
      <JButton id="b1" aria-label="Filtros" aria-pressed aria-expanded={false} aria-controls="panel-1" aria-haspopup="menu">
        F
      </JButton>,
    );
    const button = screen.getByRole('button', { name: 'Filtros' });

    expect(button).toHaveAttribute('id', 'b1');
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveAttribute('aria-controls', 'panel-1');
    expect(button).toHaveAttribute('aria-haspopup', 'menu');
  });
});

describe('JButton density (S-FND-18, 1.5.2)', () => {
  const MD_151 =
    'jbutton inline-flex items-center justify-center gap-2 font-medium transition-colors duration-200 ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ' +
    'disabled:pointer-events-none disabled:opacity-50 ' +
    'bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-500 ' +
    'min-h-11 sm:min-h-9 px-4 py-2 text-sm rounded-md';

  const heightClasses = (button: HTMLElement): string[] =>
    Array.from(button.classList).filter((token) => /(^|:)min-h-/.test(token)).sort();

  it('keeps the 1.5.1 class string without density', () => {
    render(<JButton>Guardar</JButton>);
    expect(screen.getByRole('button').className).toBe(MD_151);
  });

  it('touch is 44 px at every width', () => {
    render(<JButton density="touch">Guardar</JButton>);
    expect(heightClasses(screen.getByRole('button'))).toEqual(['min-h-11', 'sm:min-h-11']);
  });

  it('compact is 36 px at every width, even on a size that is 44 px', () => {
    render(<JButton size="lg" density="compact">Guardar</JButton>);
    expect(heightClasses(screen.getByRole('button'))).toEqual(['min-h-9', 'sm:min-h-9']);
  });

  it('auto is 44 px below sm and 36 px from sm, even on a size that is 44 px', () => {
    render(<JButton size="lg" density="auto">Guardar</JButton>);
    expect(heightClasses(screen.getByRole('button'))).toEqual(['min-h-11', 'sm:min-h-9']);
  });

  it('applies to the icon size without changing its square target', () => {
    render(<JButton size="icon" density="compact" aria-label="Cerrar">x</JButton>);
    const button = screen.getByRole('button', { name: 'Cerrar' });

    expect(heightClasses(button)).toEqual(['min-h-9', 'sm:min-h-9']);
    expect(button).toHaveClass('min-w-11', 'sm:min-w-9');
  });
});

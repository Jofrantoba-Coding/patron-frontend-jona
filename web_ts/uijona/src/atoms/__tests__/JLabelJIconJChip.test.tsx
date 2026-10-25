import { render, screen, fireEvent } from '@testing-library/react';
import { JLabel } from '../JLabel';
import { JIcon } from '../JIcon';
import { JChip } from '../JChip';

describe('JLabel', () => {
  it('prevents click when disabled', () => {
    const onClick = vi.fn();
    render(<JLabel variant="link" href="/settings" disabled onClick={onClick}>Settings</JLabel>);

    fireEvent.click(screen.getByText('Settings'));

    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByText('Settings')).toHaveAttribute('aria-disabled', 'true');
  });
});

describe('JIcon', () => {
  it('renders an accessible icon-only button', () => {
    render(<JIcon icon={<span aria-hidden="true">+</span>} label="Add item" />);
    expect(screen.getByRole('button', { name: 'Add item' })).toBeInTheDocument();
  });

  it('passes the JButton accessibility props to the native button (S-FND-17)', () => {
    render(
      <JIcon
        icon={<span aria-hidden="true">+</span>}
        label="Agregar"
        title="Agregar (Alt+A)"
        aria-keyshortcuts="Alt+A"
        aria-describedby="r1"
        aria-expanded={false}
        aria-controls="menu-1"
        aria-haspopup="menu"
        aria-pressed={false}
      />,
    );
    const button = screen.getByRole('button', { name: 'Agregar' });

    expect(button).toHaveAttribute('title', 'Agregar (Alt+A)');
    expect(button).toHaveAttribute('aria-keyshortcuts', 'Alt+A');
    expect(button).toHaveAttribute('aria-describedby', 'r1');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveAttribute('aria-controls', 'menu-1');
    expect(button).toHaveAttribute('aria-haspopup', 'menu');
    expect(button).toHaveAttribute('aria-pressed', 'false');
  });

  it('forwards density to its button', () => {
    render(<JIcon icon={<span aria-hidden="true">+</span>} label="Agregar" density="touch" />);
    const button = screen.getByRole('button', { name: 'Agregar' });

    expect(button).toHaveClass('min-h-11', 'sm:min-h-11');
    expect(button).not.toHaveAttribute('density');
  });
});

describe('JChip', () => {
  it('calls onRemove when removable action is clicked', () => {
    const onRemove = vi.fn();
    render(<JChip removable onRemove={onRemove}>Active</JChip>);

    fireEvent.click(screen.getByRole('button', { name: 'Remove' }));

    expect(onRemove).toHaveBeenCalledTimes(1);
  });
});

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
});

describe('JChip', () => {
  it('calls onRemove when removable action is clicked', () => {
    const onRemove = vi.fn();
    render(<JChip removable onRemove={onRemove}>Active</JChip>);

    fireEvent.click(screen.getByRole('button', { name: 'Remove' }));

    expect(onRemove).toHaveBeenCalledTimes(1);
  });
});

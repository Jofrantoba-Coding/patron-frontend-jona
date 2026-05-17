import { render, screen, fireEvent } from '@testing-library/react';
import { JLabel } from '../JLabel';
import { IconButtonAtom } from '../IconButtonAtom';
import { ChipAtom } from '../ChipAtom';

describe('LinkAtom', () => {
  it('prevents click when disabled', () => {
    const onClick = vi.fn();
    render(<JLabel variant="link" href="/settings" disabled onClick={onClick}>Settings</JLabel>);

    fireEvent.click(screen.getByText('Settings'));

    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByText('Settings')).toHaveAttribute('aria-disabled', 'true');
  });
});

describe('IconButtonAtom', () => {
  it('renders an accessible icon-only button', () => {
    render(<IconButtonAtom icon={<span aria-hidden="true">+</span>} label="Add item" />);
    expect(screen.getByRole('button', { name: 'Add item' })).toBeInTheDocument();
  });
});

describe('ChipAtom', () => {
  it('calls onRemove when removable action is clicked', () => {
    const onRemove = vi.fn();
    render(<ChipAtom removable onRemove={onRemove}>Active</ChipAtom>);

    fireEvent.click(screen.getByRole('button', { name: 'Remove' }));

    expect(onRemove).toHaveBeenCalledTimes(1);
  });
});

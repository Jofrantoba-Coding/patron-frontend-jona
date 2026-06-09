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

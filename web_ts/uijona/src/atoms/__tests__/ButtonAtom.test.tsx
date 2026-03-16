import { render, screen, fireEvent } from '@testing-library/react';
import { ButtonAtom } from '../ButtonAtom';

describe('ButtonAtom', () => {
  it('renders children', () => {
    render(<ButtonAtom>Click me</ButtonAtom>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<ButtonAtom onClick={onClick}>Click</ButtonAtom>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<ButtonAtom disabled>Click</ButtonAtom>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('is disabled and shows spinner when loading', () => {
    render(<ButtonAtom loading>Click</ButtonAtom>);
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('does not call onClick when disabled', () => {
    const onClick = vi.fn();
    render(<ButtonAtom disabled onClick={onClick}>Click</ButtonAtom>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('applies fullWidth class', () => {
    render(<ButtonAtom fullWidth>Click</ButtonAtom>);
    expect(screen.getByRole('button')).toHaveClass('w-full');
  });
});

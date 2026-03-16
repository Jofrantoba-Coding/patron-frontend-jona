import { render, screen, fireEvent } from '@testing-library/react';
import { CheckboxAtom } from '../CheckboxAtom';

describe('CheckboxAtom', () => {
  it('renders with unchecked state', () => {
    render(<CheckboxAtom aria-label="Accept terms" />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'false');
  });

  it('renders with checked state', () => {
    render(<CheckboxAtom checked aria-label="Accept terms" />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true');
  });

  it('calls onCheckedChange with toggled value', () => {
    const onCheckedChange = vi.fn();
    render(<CheckboxAtom checked={false} onCheckedChange={onCheckedChange} aria-label="Accept" />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('does not call onCheckedChange when disabled', () => {
    const onCheckedChange = vi.fn();
    render(<CheckboxAtom disabled onCheckedChange={onCheckedChange} aria-label="Accept" />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(onCheckedChange).not.toHaveBeenCalled();
  });
});

import { render, screen, fireEvent } from '@testing-library/react';
import { JCheckBox } from '../JCheckBox';

describe('CheckboxAtom', () => {
  it('renders with unchecked state', () => {
    render(<JCheckBox aria-label="Accept terms" />);
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('renders with checked state', () => {
    render(<JCheckBox checked aria-label="Accept terms" />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('calls onCheckedChange with toggled value', () => {
    const onCheckedChange = vi.fn();
    render(<JCheckBox checked={false} onCheckedChange={onCheckedChange} aria-label="Accept" />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('does not call onCheckedChange when disabled', () => {
    const onCheckedChange = vi.fn();
    render(<JCheckBox disabled onCheckedChange={onCheckedChange} aria-label="Accept" />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(onCheckedChange).not.toHaveBeenCalled();
  });
});

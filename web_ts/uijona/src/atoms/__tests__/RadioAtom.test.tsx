import { render, screen, fireEvent } from '@testing-library/react';
import { JRadioButton } from '../JRadioButton';

describe('JRadioButton', () => {
  it('emits checked value and option value', () => {
    const onCheckedChange = vi.fn();
    render(<JRadioButton aria-label="Monthly" value="monthly" onCheckedChange={onCheckedChange} />);

    fireEvent.click(screen.getByLabelText('Monthly'));

    expect(onCheckedChange).toHaveBeenCalledWith(true, 'monthly', expect.any(Object));
  });

  it('does not emit when disabled', () => {
    const onCheckedChange = vi.fn();
    render(<JRadioButton aria-label="Monthly" value="monthly" disabled onCheckedChange={onCheckedChange} />);

    fireEvent.click(screen.getByLabelText('Monthly'));

    expect(onCheckedChange).not.toHaveBeenCalled();
  });
});

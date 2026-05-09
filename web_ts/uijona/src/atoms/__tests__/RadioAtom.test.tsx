import { render, screen, fireEvent } from '@testing-library/react';
import { RadioAtom } from '../RadioAtom';

describe('RadioAtom', () => {
  it('emits checked value and option value', () => {
    const onCheckedChange = vi.fn();
    render(<RadioAtom aria-label="Monthly" value="monthly" onCheckedChange={onCheckedChange} />);

    fireEvent.click(screen.getByLabelText('Monthly'));

    expect(onCheckedChange).toHaveBeenCalledWith(true, 'monthly', expect.any(Object));
  });

  it('does not emit when disabled', () => {
    const onCheckedChange = vi.fn();
    render(<RadioAtom aria-label="Monthly" value="monthly" disabled onCheckedChange={onCheckedChange} />);

    fireEvent.click(screen.getByLabelText('Monthly'));

    expect(onCheckedChange).not.toHaveBeenCalled();
  });
});

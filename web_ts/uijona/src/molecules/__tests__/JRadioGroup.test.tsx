import { render, screen, fireEvent } from '@testing-library/react';
import { JRadioGroup } from '../JRadioGroup';

describe('JRadioGroup', () => {
  it('supports uncontrolled selection and emits selected value', () => {
    const onValueChange = vi.fn();
    render(
      <JRadioGroup
        name="billing"
        defaultValue="monthly"
        options={[
          { value: 'monthly', label: 'Monthly' },
          { value: 'yearly', label: 'Yearly' },
        ]}
        onValueChange={onValueChange}
      />
    );

    fireEvent.click(screen.getByLabelText('Yearly'));

    expect(onValueChange).toHaveBeenCalledWith('yearly', expect.objectContaining({ value: 'yearly' }));
    expect(screen.getByLabelText('Yearly')).toBeChecked();
  });

  it('does not emit for disabled options', () => {
    const onValueChange = vi.fn();
    render(
      <JRadioGroup
        name="billing"
        options={[{ value: 'yearly', label: 'Yearly', disabled: true }]}
        onValueChange={onValueChange}
      />
    );

    fireEvent.click(screen.getByLabelText('Yearly'));

    expect(onValueChange).not.toHaveBeenCalled();
  });
});

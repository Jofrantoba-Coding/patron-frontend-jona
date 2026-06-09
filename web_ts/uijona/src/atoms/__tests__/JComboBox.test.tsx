import { render, screen, fireEvent } from '@testing-library/react';
import { JComboBox } from '../JComboBox';

const options = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
];

describe('JComboBox', () => {
  it('renders options', () => {
    render(<JComboBox options={options} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('calls onChange with value string (Observer pattern)', () => {
    const onChange = vi.fn();
    render(<JComboBox options={options} onChange={onChange} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'b' } });
    expect(onChange).toHaveBeenCalledWith('b', expect.any(Object));
  });

  it('renders placeholder option', () => {
    render(<JComboBox options={options} placeholder="Pick one" />);
    expect(screen.getByText('Pick one')).toBeInTheDocument();
  });

  it('applies error state', () => {
    render(<JComboBox options={options} hasError />);
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
  });
});

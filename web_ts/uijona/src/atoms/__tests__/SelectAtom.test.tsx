import { render, screen, fireEvent } from '@testing-library/react';
import { SelectAtom } from '../SelectAtom';

const options = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
];

describe('SelectAtom', () => {
  it('renders options', () => {
    render(<SelectAtom options={options} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('calls onChange with value string (Observer pattern)', () => {
    const onChange = vi.fn();
    render(<SelectAtom options={options} onChange={onChange} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'b' } });
    expect(onChange).toHaveBeenCalledWith('b', expect.any(Object));
  });

  it('renders placeholder option', () => {
    render(<SelectAtom options={options} placeholder="Pick one" />);
    expect(screen.getByText('Pick one')).toBeInTheDocument();
  });

  it('applies error state', () => {
    render(<SelectAtom options={options} hasError />);
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
  });
});

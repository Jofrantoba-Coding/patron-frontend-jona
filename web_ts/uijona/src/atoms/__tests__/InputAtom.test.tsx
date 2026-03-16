import { render, screen, fireEvent } from '@testing-library/react';
import { InputAtom } from '../InputAtom';

describe('InputAtom', () => {
  it('renders an input element', () => {
    render(<InputAtom placeholder="Type here" />);
    expect(screen.getByPlaceholderText('Type here')).toBeInTheDocument();
  });

  it('calls onChange with value string (Observer pattern)', () => {
    const onChange = vi.fn();
    render(<InputAtom onChange={onChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'hello' } });
    expect(onChange).toHaveBeenCalledWith('hello', expect.any(Object));
  });

  it('calls onBlur with value string', () => {
    const onBlur = vi.fn();
    render(<InputAtom onBlur={onBlur} defaultValue="test" />);
    fireEvent.blur(screen.getByRole('textbox'));
    expect(onBlur).toHaveBeenCalledWith('test', expect.any(Object));
  });

  it('calls onEnterPress when Enter is pressed', () => {
    const onEnterPress = vi.fn();
    render(<InputAtom onEnterPress={onEnterPress} defaultValue="abc" />);
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' });
    expect(onEnterPress).toHaveBeenCalledWith('abc', expect.any(Object));
  });

  it('applies error styles when hasError is true', () => {
    render(<InputAtom hasError />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });
});

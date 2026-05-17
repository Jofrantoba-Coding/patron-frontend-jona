import { render, screen, fireEvent } from '@testing-library/react';
import { JTextBox } from '../JTextBox';

describe('JTextBox', () => {
  it('renders an input element', () => {
    render(<JTextBox placeholder="Type here" />);
    expect(screen.getByPlaceholderText('Type here')).toBeInTheDocument();
  });

  it('calls onChange with value string (Observer pattern)', () => {
    const onChange = vi.fn();
    render(<JTextBox onChange={onChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'hello' } });
    expect(onChange).toHaveBeenCalledWith('hello', expect.any(Object));
  });

  it('calls onBlur with value string', () => {
    const onBlur = vi.fn();
    render(<JTextBox onBlur={onBlur} defaultValue="test" />);
    fireEvent.blur(screen.getByRole('textbox'));
    expect(onBlur).toHaveBeenCalledWith('test', expect.any(Object));
  });

  it('calls onEnterPress when Enter is pressed', () => {
    const onEnterPress = vi.fn();
    render(<JTextBox onEnterPress={onEnterPress} defaultValue="abc" />);
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' });
    expect(onEnterPress).toHaveBeenCalledWith('abc', expect.any(Object));
  });

  it('applies error styles when hasError is true', () => {
    render(<JTextBox hasError />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });
});

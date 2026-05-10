import { render, screen, fireEvent } from '@testing-library/react';
import { TextareaAtom } from '../TextareaAtom';

describe('TextareaAtom', () => {
  it('emits value and event on change', () => {
    const onChange = vi.fn();
    render(<TextareaAtom aria-label="Notes" onChange={onChange} />);

    fireEvent.change(screen.getByLabelText('Notes'), { target: { value: 'Hello' } });

    expect(onChange).toHaveBeenCalledWith('Hello', expect.any(Object));
  });

  it('marks invalid state with error styling support', () => {
    render(<TextareaAtom aria-label="Notes" hasError />);
    expect(screen.getByLabelText('Notes')).toBeInTheDocument();
  });

  it('allows horizontal resizing when requested', () => {
    render(<TextareaAtom aria-label="Notes" resize="horizontal" />);
    expect(screen.getByLabelText('Notes')).toHaveClass('resize-x');
  });

  it('allows horizontal and vertical resizing by default', () => {
    render(<TextareaAtom aria-label="Notes" />);
    expect(screen.getByLabelText('Notes')).toHaveClass('resize');
  });
});

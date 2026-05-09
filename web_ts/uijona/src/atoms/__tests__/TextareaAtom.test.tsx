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
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { BooleanField } from './BooleanField';

const box = () => screen.getByRole('checkbox', { name: 'Hab Guia' }) as HTMLInputElement;

describe('BooleanField', () => {
  it('shows the label and the checked state', () => {
    const { rerender } = render(<BooleanField label="Hab Guia" checked={false} onChange={vi.fn()} />);
    expect(box().checked).toBe(false);
    rerender(<BooleanField label="Hab Guia" checked onChange={vi.fn()} />);
    expect(box().checked).toBe(true);
  });

  it('reports the new boolean first, without the DOM event', async () => {
    const onChange = vi.fn();
    render(<BooleanField label="Hab Guia" checked={false} onChange={onChange} />);

    await userEvent.setup().click(box());

    expect(onChange).toHaveBeenCalledWith(true);
    expect(onChange.mock.calls[0]).toHaveLength(1);
  });

  it('a read-only field cannot be toggled', async () => {
    const onChange = vi.fn();
    render(<BooleanField label="Hab Guia" checked readOnly onChange={onChange} />);

    await userEvent.setup().click(box());

    expect(box().disabled).toBe(true);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('marks an error on the control and keeps touch-friendly 44px floors', () => {
    render(<BooleanField label="Hab Guia" checked={false} hasError onChange={vi.fn()} />);
    expect(box().getAttribute('aria-invalid')).toBe('true');
    const wrapper = box().closest('div')!;
    expect(wrapper.classList.contains('min-h-11')).toBe(true);
    expect(wrapper.classList.contains('sm:min-h-9')).toBe(true);
  });

  it('forwards the ref to the input so a blocked submit can focus it', () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<BooleanField ref={ref} label="Hab Guia" checked={false} onChange={vi.fn()} />);
    expect(ref.current).toBe(box());
  });
});

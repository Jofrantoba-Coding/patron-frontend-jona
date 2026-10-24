import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { TextAreaField } from './TextAreaField';

function Harness({ initial = '', max = 500, uppercase, readOnly, rows, onBlur }: { initial?: string; max?: number; uppercase?: boolean; readOnly?: boolean; rows?: number; onBlur?: (value: string) => void }) {
  const [value, setValue] = useState(initial);
  return <TextAreaField name="comentario" label="Comentario" value={value} maxLength={max} uppercase={uppercase} readOnly={readOnly} rows={rows} onChange={setValue} onBlur={onBlur} />;
}
const box = () => screen.getByLabelText('Comentario') as HTMLTextAreaElement;

describe('TextAreaField (R-CRUD-18, S-CRUD-46)', () => {
  it('renders a multi-line input of 4 rows by default and honors rows', () => {
    const { unmount } = render(<Harness />);
    expect(box().tagName).toBe('TEXTAREA');
    expect(box().rows).toBe(4);
    unmount();
    render(<Harness rows={6} />);
    expect(box().rows).toBe(6);
  });

  it('S-CRUD-46 Enter inserts a line break', async () => {
    render(<Harness />);
    await userEvent.type(box(), 'uno{Enter}dos');
    expect(box().value).toBe('uno\ndos');
  });

  it('S-CRUD-46 Enter does not reach a surrounding form submit', async () => {
    const submit = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
    render(
      <form onSubmit={submit}>
        <Harness />
      </form>,
    );
    await userEvent.type(box(), 'a{Enter}b');
    expect(submit).not.toHaveBeenCalled();
    expect(box().value).toBe('a\nb');
  });

  it('S-CRUD-46 the 501st typed character is ignored', async () => {
    render(<Harness initial={'a'.repeat(500)} />);
    await userEvent.type(box(), 'b');
    expect(box().value).toHaveLength(500);
    expect(box().value).not.toContain('b');
  });

  it('S-CRUD-46 a paste that would pass the max is ignored whole, one that fits over a selection is accepted (S-CRUD-14)', async () => {
    render(<Harness initial={'a'.repeat(495)} />);
    box().focus();
    await userEvent.paste('b'.repeat(10));
    expect(box().value).toBe('a'.repeat(495));
    box().setSelectionRange(0, 5);
    await userEvent.paste('c'.repeat(10));
    expect(box().value).toBe('c'.repeat(10) + 'a'.repeat(490));
  });

  it('S-CRUD-46 upper uppercases typed and pasted text', async () => {
    render(<Harness uppercase />);
    await userEvent.type(box(), 'hola');
    box().focus();
    await userEvent.paste(' mundo');
    expect(box().value).toBe('HOLA MUNDO');
  });

  it('reports the value on blur and shows a read-only value without accepting edits', async () => {
    const onBlur = vi.fn();
    const { unmount } = render(<Harness initial="x" onBlur={onBlur} />);
    box().focus();
    box().blur();
    expect(onBlur).toHaveBeenCalledWith('x');
    unmount();
    render(<Harness initial="fijo" readOnly />);
    await userEvent.type(box(), 'zzz');
    expect(box().value).toBe('fijo');
    expect(box().readOnly).toBe(true);
  });
});

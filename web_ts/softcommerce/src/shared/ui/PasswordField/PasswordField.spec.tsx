import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { PasswordField } from './PasswordField';

function Harness({ initial = '', confirmation = false, max = 20 }: { initial?: string; confirmation?: boolean; max?: number }) {
  const [value, setValue] = useState(initial);
  const [again, setAgain] = useState('');
  return (
    <PasswordField
      name="clave"
      label="Contraseña"
      value={value}
      maxLength={max}
      onChange={setValue}
      {...(confirmation ? { confirmLabel: 'Confirmar contraseña', confirmValue: again, onConfirmChange: setAgain } : {})}
    />
  );
}
const input = () => screen.getByLabelText('Contraseña') as HTMLInputElement;
const confirmInput = () => screen.getByLabelText('Confirmar contraseña') as HTMLInputElement;
const toggle = () => screen.getByLabelText('Mostrar caracteres') as HTMLInputElement;

describe('PasswordField (R-CRUD-17, S-CRUD-42)', () => {
  it('is masked and offers the desktop "Mostrar caracteres" control', () => {
    render(<Harness />);
    expect(input().type).toBe('password');
    expect(toggle().checked).toBe(false);
  });

  it('the show control reveals the value and keeps it, and hides it again', async () => {
    render(<Harness />);
    await userEvent.type(input(), 'secreto1');
    await userEvent.click(toggle());
    expect([input().type, input().value]).toEqual(['text', 'secreto1']);
    await userEvent.click(toggle());
    expect([input().type, input().value]).toEqual(['password', 'secreto1']);
  });

  it('S-CRUD-42 the 21st character is ignored', async () => {
    render(<Harness />);
    await userEvent.type(input(), 'a'.repeat(21));
    expect(input().value).toBe('a'.repeat(20));
  });

  it('S-CRUD-14 a 10-character paste over 10 selected characters of a 20-character value is accepted (the result fits)', async () => {
    render(<Harness initial={'a'.repeat(20)} />);
    input().focus();
    input().setSelectionRange(0, 10);
    await userEvent.paste('b'.repeat(10));
    expect(input().value).toBe('b'.repeat(10) + 'a'.repeat(10));
  });

  it('a 15-character paste over 10 selected characters of a 20-character value would make 25 and is ignored whole', async () => {
    render(<Harness initial={'a'.repeat(20)} />);
    input().focus();
    input().setSelectionRange(0, 10);
    await userEvent.paste('b'.repeat(15));
    expect(input().value).toBe('a'.repeat(20));
  });

  it('a paste that would pass the max is ignored whole', async () => {
    render(<Harness initial={'a'.repeat(20)} />);
    input().focus();
    await userEvent.paste('b');
    expect(input().value).toBe('a'.repeat(20));
  });

  it('with a confirmation it renders a second masked input that the same control reveals, with the same max', async () => {
    render(<Harness confirmation />);
    expect(confirmInput().type).toBe('password');
    await userEvent.type(confirmInput(), 'c'.repeat(21));
    expect(confirmInput().value).toBe('c'.repeat(20));
    await userEvent.click(toggle());
    expect([input().type, confirmInput().type]).toEqual(['text', 'text']);
  });

  it('without a confirmation there is a single input', () => {
    render(<Harness />);
    expect(screen.queryByLabelText('Confirmar contraseña')).toBeNull();
  });

  it('never leaves a spell-check or autofill trail: autocomplete is new-password', () => {
    render(<Harness confirmation />);
    expect([input().autocomplete, confirmInput().autocomplete]).toEqual(['new-password', 'new-password']);
  });

  it('read-only takes no edits', async () => {
    render(<PasswordField name="clave" label="Contraseña" value="abc" maxLength={20} readOnly onChange={() => { throw new Error('edited'); }} />);
    await userEvent.type(input(), 'zz');
    expect(input().value).toBe('abc');
  });
});

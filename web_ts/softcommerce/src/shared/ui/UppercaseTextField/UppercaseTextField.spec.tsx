import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { UppercaseTextField } from './UppercaseTextField';

function Harness({ initial = '', uppercase = false }: { initial?: string; uppercase?: boolean }) {
  const [value, setValue] = useState(initial);
  return <UppercaseTextField aria-label="campo" value={value} maxLength={100} uppercase={uppercase} onChange={setValue} />;
}
const input = () => screen.getByLabelText('campo') as HTMLInputElement;

describe('UppercaseTextField', () => {
  it('ignores typing past maxLength and keeps the value', async () => {
    render(<Harness initial={'A'.repeat(100)} />);
    await userEvent.type(input(), 'B');
    expect(input().value).toBe('A'.repeat(100));
  });

  it('ignores a whole paste that would overflow, without truncating', async () => {
    render(<Harness initial={'A'.repeat(95)} />);
    input().focus();
    await userEvent.paste('B'.repeat(10));
    expect(input().value).toBe('A'.repeat(95));
  });

  it('accepts a paste over a selection when the result is exactly maxLength', async () => {
    render(<Harness initial={'A'.repeat(95)} />);
    input().focus();
    input().setSelectionRange(0, 5);
    await userEvent.paste('B'.repeat(10));
    expect(input().value).toBe('B'.repeat(10) + 'A'.repeat(90));
  });

  it.each([
    { uppercase: true, typed: 'lima', expected: 'LIMA' },
    { uppercase: false, typed: 'lima', expected: 'lima' },
  ])('uppercase=$uppercase: typing "$typed" yields "$expected"', async ({ uppercase, typed, expected }) => {
    render(<Harness uppercase={uppercase} />);
    await userEvent.type(input(), typed);
    expect(input().value).toBe(expected);
  });
});

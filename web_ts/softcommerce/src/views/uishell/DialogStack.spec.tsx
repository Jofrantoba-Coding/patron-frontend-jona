import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { DialogStackProvider, GuardedOptionPane } from './DialogStackProvider';

/** A tab body with two nested dialogs, both reacting to Esc through jona-ui. */
function Harness({ initiallyOpen = { outer: true, inner: true } }: { initiallyOpen?: { outer: boolean; inner: boolean } }) {
  const [outer, setOuter] = useState(initiallyOpen.outer);
  const [inner, setInner] = useState(initiallyOpen.inner);
  return (
    <DialogStackProvider>
      <section aria-label="tab body">tab content</section>
      <GuardedOptionPane open={outer} title="Outer" cancelLabel="Close outer" confirmLabel="Ok outer" onConfirm={() => setOuter(false)} onClose={() => setOuter(false)} />
      <GuardedOptionPane open={inner} title="Inner" cancelLabel="Close inner" confirmLabel="Ok inner" onConfirm={() => setInner(false)} onClose={() => setInner(false)} />
      <button type="button" onClick={() => setInner(true)}>reopen inner</button>
    </DialogStackProvider>
  );
}

const isOpen = (title: string) => screen.queryByText(title) !== null;

describe('Esc dialog stack', () => {
  it('S-SHELL-16 Esc closes only the topmost dialog and the tab content stays', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    expect(isOpen('Outer') && isOpen('Inner')).toBe(true);

    await user.keyboard('{Escape}');

    expect(isOpen('Inner')).toBe(false);
    expect(isOpen('Outer')).toBe(true);
    expect(screen.getByLabelText('tab body').textContent).toBe('tab content');
  });

  it('closes the dialogs one per Esc, top first, then does nothing', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.keyboard('{Escape}');
    await user.keyboard('{Escape}');
    expect(isOpen('Outer')).toBe(false);
    expect(isOpen('Inner')).toBe(false);

    await user.keyboard('{Escape}');
    expect(screen.getByLabelText('tab body')).toBeTruthy();
  });

  it('uses the most recently opened dialog as the top, not the declaration order', async () => {
    const user = userEvent.setup();
    render(<Harness initiallyOpen={{ outer: true, inner: false }} />);
    await user.click(screen.getByRole('button', { name: 'reopen inner' }));
    await user.keyboard('{Escape}');
    expect(isOpen('Inner')).toBe(false);
    expect(isOpen('Outer')).toBe(true);

    await user.keyboard('{Escape}');
    expect(isOpen('Outer')).toBe(false);
  });

  it('does not guard clicks: Cancel on a dialog below the top closes it while the top stays', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(screen.getByRole('button', { name: 'Close outer' }));

    expect(isOpen('Outer')).toBe(false);
    expect(isOpen('Inner')).toBe(true);
  });

  it('still closes the lower dialog with Esc after a click closed the one above it', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(screen.getByRole('button', { name: 'Close inner' }));
    await user.keyboard('{Escape}');

    expect(isOpen('Outer')).toBe(false);
  });
});

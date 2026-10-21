/**
 * Design-quality contract: FOCUS MANAGEMENT IN MODAL OVERLAYS
 * `aria-modal="true"` tells assistive tech the page behind is inert, but it does
 * not stop the browser's Tab key. A modal must: move focus in on open, keep
 * Tab/Shift+Tab inside, and give focus back to the opener on close.
 * Parity reference: uijona-4ngular core/focus.ts + focus-management.spec.ts.
 */
import React, { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { JFocusTrap, focusableIn } from '../../lib/focus';
import { JDialog } from '../../molecules/JDialog';
import { JDrawer } from '../../molecules/JDrawer';
import { JOptionPane } from '../../molecules/JOptionPane';

const tab = (target: Element, shiftKey = false) =>
  fireEvent.keyDown(target, { key: 'Tab', shiftKey });

// Nodes created by hand (outside RTL's containers) are removed after each test.
const attached: HTMLElement[] = [];
const attach = <T extends HTMLElement>(el: T): T => {
  document.body.appendChild(el);
  attached.push(el);
  return el;
};

const buildPanel = (inner: string, focusable = true) => {
  const panel = document.createElement('div');
  if (focusable) panel.tabIndex = -1;
  panel.innerHTML = inner;
  return attach(panel);
};

const buildOpener = () => {
  const opener = attach(document.createElement('button'));
  opener.focus();
  return opener;
};

afterEach(() => { attached.splice(0).forEach((el) => el.remove()); });

describe('focusableIn', () => {
  it('lists keyboard focusables in document order, skipping disabled and hidden ones', () => {
    const panel = buildPanel(`
      <button id="a">a</button>
      <button id="b" disabled>b</button>
      <input id="c" />
      <input id="d" type="hidden" />
      <a id="e" href="#x">e</a>
      <span id="f" tabindex="0">f</span>
      <span id="g" tabindex="-1">g</span>
      <button id="h" hidden>h</button>
      <button id="i" aria-hidden="true">i</button>
    `);
    expect(focusableIn(panel).map((el) => el.id)).toEqual(['a', 'c', 'e', 'f']);
  });
});

describe('JFocusTrap', () => {
  it('moves focus to the panel on activate and back to the opener on release', () => {
    const opener = buildOpener();
    const panel = buildPanel('<button>ok</button>');
    const trap = new JFocusTrap();

    trap.activate(panel);
    expect(document.activeElement).toBe(panel);

    trap.release();
    expect(document.activeElement).toBe(opener);
  });

  it('falls back to the first focusable when the panel itself is not focusable', () => {
    const panel = buildPanel('<button id="first">1</button><button>2</button>', false);
    new JFocusTrap().activate(panel);
    expect(document.activeElement?.id).toBe('first');
  });

  it('a second activate does not overwrite the saved opener', () => {
    const opener = buildOpener();
    const panel = buildPanel('<button id="inside">x</button>');
    const trap = new JFocusTrap();
    trap.activate(panel);
    (panel.querySelector('#inside') as HTMLElement).focus();
    trap.activate(panel);
    trap.release();
    expect(document.activeElement).toBe(opener);
  });

  it('cycles Tab from the last focusable to the first and Shift+Tab the other way', () => {
    const panel = buildPanel('<button id="first">1</button><button id="mid">2</button><button id="last">3</button>');
    const trap = new JFocusTrap();
    const onKey = (e: KeyboardEvent) => trap.handleKeyDown(e, panel);
    panel.addEventListener('keydown', onKey);

    (panel.querySelector('#last') as HTMLElement).focus();
    tab(document.activeElement!);
    expect(document.activeElement?.id).toBe('first');

    tab(document.activeElement!, true);
    expect(document.activeElement?.id).toBe('last');
  });

  it('leaves Tab alone in the middle of the panel (the browser moves focus)', () => {
    const panel = buildPanel('<button id="first">1</button><button id="mid">2</button><button id="last">3</button>');
    const trap = new JFocusTrap();
    panel.addEventListener('keydown', (e) => trap.handleKeyDown(e, panel));
    (panel.querySelector('#mid') as HTMLElement).focus();
    const notCancelled = tab(document.activeElement!);
    expect(notCancelled).toBe(true);
    expect(document.activeElement?.id).toBe('mid');
  });

  it('swallows Tab when the panel has nothing focusable', () => {
    const panel = buildPanel('<p>text only</p>');
    const trap = new JFocusTrap();
    panel.addEventListener('keydown', (e) => trap.handleKeyDown(e, panel));
    panel.focus();
    expect(tab(panel)).toBe(false);
    expect(document.activeElement).toBe(panel);
  });
});

/** Opener button + controlled overlay, so focus restoration can be observed. */
function Harness({ render: renderOverlay }: { render: (open: boolean, close: () => void) => React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>open</button>
      {renderOverlay(open, () => setOpen(false))}
    </>
  );
}

const openFromOpener = () => {
  const opener = screen.getByRole('button', { name: 'open' });
  opener.focus();
  fireEvent.click(opener);
  return opener;
};

describe('JDialog focus management', () => {
  const renderDialog = () =>
    render(
      <Harness
        render={(open, close) => (
          <JDialog open={open} title="Edit" onClose={close} footer={<button type="button">Save</button>}>
            <input aria-label="name" />
          </JDialog>
        )}
      />,
    );

  it('moves focus into the dialog on open', () => {
    renderDialog();
    openFromOpener();
    expect(screen.getByRole('dialog')).toContainElement(document.activeElement as HTMLElement);
  });

  it('keeps Tab and Shift+Tab inside the dialog', () => {
    renderDialog();
    openFromOpener();
    const close = screen.getByRole('button', { name: 'Close dialog' });
    const save = screen.getByRole('button', { name: 'Save' });

    save.focus();
    tab(save);
    expect(document.activeElement).toBe(close);

    tab(close, true);
    expect(document.activeElement).toBe(save);
  });

  it('returns focus to the opener when it closes', () => {
    renderDialog();
    const opener = openFromOpener();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(opener);
  });
});

describe('JDrawer focus management', () => {
  const renderDrawer = () =>
    render(
      <Harness
        render={(open, close) => (
          <JDrawer open={open} title="Filters" onClose={close} footer={<button type="button">Apply</button>}>
            drawer body
          </JDrawer>
        )}
      />,
    );

  it('is removed from the accessibility tree and inert while closed', () => {
    renderDrawer();
    expect(screen.queryByRole('dialog')).toBeNull();
    const inert = document.querySelector('[inert]');
    expect(inert).not.toBeNull();
    expect(inert).toHaveTextContent('drawer body');
    expect(inert).not.toHaveAttribute('aria-modal');
  });

  it('becomes a focused modal dialog when open', () => {
    renderDrawer();
    openFromOpener();
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).not.toHaveAttribute('inert');
    expect(dialog).toContainElement(document.activeElement as HTMLElement);
  });

  it('cycles Tab inside and restores focus to the opener on close', () => {
    renderDrawer();
    const opener = openFromOpener();
    const close = screen.getByRole('button', { name: 'Cerrar panel' });
    const apply = screen.getByRole('button', { name: 'Apply' });

    apply.focus();
    tab(apply);
    expect(document.activeElement).toBe(close);

    fireEvent.click(close);
    expect(document.activeElement).toBe(opener);
  });
});

describe('JOptionPane focus management', () => {
  const renderPane = () =>
    render(
      <Harness
        render={(open, close) => (
          <JOptionPane open={open} title="Delete item?" variant="danger" onConfirm={close} onCancel={close} />
        )}
      />,
    );

  it('focuses the panel, not the destructive confirm button, on open', () => {
    renderPane();
    openFromOpener();
    const pane = screen.getByRole('alertdialog');
    expect(document.activeElement).toBe(pane);
  });

  it('keeps Shift+Tab inside the pane', () => {
    renderPane();
    openFromOpener();
    const buttons = screen.getByRole('alertdialog').querySelectorAll('button');
    expect(buttons.length).toBe(2);
    const [first, last] = [buttons[0], buttons[1]];
    first.focus();
    tab(first, true);
    expect(document.activeElement).toBe(last);
  });

  it('returns focus to the opener after cancel', () => {
    renderPane();
    const opener = openFromOpener();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('alertdialog')).toBeNull();
    expect(document.activeElement).toBe(opener);
  });
});

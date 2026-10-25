import React, { useRef, useState } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { useMenuPopup } from '../menuPopup';

/** A menu button whose popup closes through the helper (D9). */
const Harness: React.FC<{ onClose?: (reason: string) => void }> = ({
  onClose,
}) => {
  const [open, setOpen] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popup = useMenuPopup({
    open,
    rootRef,
    triggerRef,
    onClose: (reason) => {
      onClose?.(reason);
      setOpen(false);
    },
  });
  return (
    <div>
      <div ref={rootRef} onKeyDown={popup.onKeyDown}>
        <button ref={triggerRef} type="button" onClick={() => setOpen(true)}>
          Abrir
        </button>
        {open && (
          <div role="menu" aria-label="Opciones">
            <button type="button" role="menuitem">
              Uno
            </button>
          </div>
        )}
      </div>
      <button type="button">Fuera</button>
    </div>
  );
};

describe('useMenuPopup (D9 Esc ownership)', () => {
  it('Esc on the menu root closes it, prevents the default and does not reach the document', () => {
    const onClose = vi.fn();
    const documentKey = vi.fn();
    document.addEventListener('keydown', documentKey);
    render(<Harness onClose={onClose} />);

    const item = screen.getByRole('menuitem', { name: 'Uno' });
    item.focus();
    const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    act(() => {
      item.dispatchEvent(event);
    });
    document.removeEventListener('keydown', documentKey);

    expect(onClose).toHaveBeenCalledWith('escape');
    expect(event.defaultPrevented).toBe(true);
    expect(documentKey).not.toHaveBeenCalled();
    expect(screen.queryByRole('menu')).toBeNull();
    expect(screen.getByRole('button', { name: 'Abrir' })).toHaveFocus();
  });

  it('other keys pass through to the document', () => {
    const documentKey = vi.fn();
    document.addEventListener('keydown', documentKey);
    render(<Harness />);

    fireEvent.keyDown(screen.getByRole('menuitem', { name: 'Uno' }), { key: 'ArrowDown' });
    document.removeEventListener('keydown', documentKey);

    expect(documentKey).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('an outside pointer press closes it; a press inside does not', () => {
    const onClose = vi.fn();
    render(<Harness onClose={onClose} />);

    fireEvent.pointerDown(screen.getByRole('menuitem', { name: 'Uno' }));
    expect(onClose).not.toHaveBeenCalled();

    fireEvent.pointerDown(screen.getByRole('button', { name: 'Fuera' }));

    expect(onClose).toHaveBeenCalledWith('outside');
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('a closed menu ignores Esc and outside presses', () => {
    const onClose = vi.fn();
    const documentKey = vi.fn();
    render(<Harness onClose={onClose} />);
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Fuera' }));
    onClose.mockClear();
    document.addEventListener('keydown', documentKey);

    fireEvent.keyDown(screen.getByRole('button', { name: 'Abrir' }), { key: 'Escape' });
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Fuera' }));
    document.removeEventListener('keydown', documentKey);

    expect(onClose).not.toHaveBeenCalled();
    expect(documentKey).toHaveBeenCalledTimes(1);
  });
});

/**
 * Focus management for modal overlays (JDialog, JOptionPane, JDrawer).
 *
 * `aria-modal="true"` tells screen readers the rest of the document is inert,
 * but it does NOT stop the browser's Tab key: without a trap, keyboard users
 * leave the overlay for controls they cannot see. Entry, cycle and return are
 * what turn a `role=dialog` panel into a usable modal.
 *
 * Mirrors uijona-4ngular `core/focus.ts`. Not part of the public API: consumed
 * by Impl layers only.
 */
import type React from 'react';
import { useCallback, useEffect, useRef } from 'react';

/** What the browser considers keyboard-focusable. */
const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

/** Focusables of the subtree, in document order, skipping hidden ones. */
export function focusableIn(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => !el.hasAttribute('hidden') && el.getAttribute('aria-hidden') !== 'true',
  );
}

/** Minimal keyboard event shape: works with native and React events. */
interface TrapKeyEvent {
  key: string;
  shiftKey: boolean;
  preventDefault(): void;
}

/**
 * Focus trap for one overlay. One instance per component.
 *
 * Initial focus goes to the PANEL, not the first button: in a delete
 * `alertdialog` the first focusable is usually "Confirm", and opening with
 * focus there turns a distracted Enter into a destructive action.
 */
export class JFocusTrap {
  private previous: HTMLElement | null = null;
  private active = false;

  /** Saves who had focus and moves it to the panel. Repeating it keeps the saved opener. */
  activate(panel: HTMLElement): void {
    if (this.active) return;
    this.active = true;

    const doc = panel.ownerDocument;
    const current = doc.activeElement;
    this.previous = current instanceof HTMLElement && current !== doc.body ? current : null;

    panel.focus();
    // Panel without tabindex: focus did not move, fall back to the first focusable.
    if (!panel.contains(doc.activeElement)) focusableIn(panel)[0]?.focus();
  }

  /** Gives focus back to whoever had it before opening. */
  release(): void {
    if (!this.active) return;
    this.active = false;

    const previous = this.previous;
    this.previous = null;
    if (previous?.isConnected) previous.focus();
  }

  /** Cycles Tab inside the panel. Call from the panel's keydown handler. */
  handleKeyDown(event: TrapKeyEvent, panel: HTMLElement): void {
    if (event.key !== 'Tab') return;

    const items = focusableIn(panel);
    if (items.length === 0) {
      // Nothing to focus inside: focus must not escape anyway.
      event.preventDefault();
      return;
    }

    const first = items[0];
    const last = items[items.length - 1];
    const current = panel.ownerDocument.activeElement;

    if (event.shiftKey && (current === first || current === panel)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (current === last || current === panel)) {
      event.preventDefault();
      first.focus();
    }
  }
}

/**
 * React binding of JFocusTrap for Impl layers: activates while `active` is true
 * (the panel must be mounted by then), releases on close or unmount, and
 * returns the keydown handler to attach to the panel.
 */
export function useFocusTrap(
  panelRef: React.RefObject<HTMLElement>,
  active: boolean,
): (event: React.KeyboardEvent<HTMLElement>) => void {
  const trapRef = useRef<JFocusTrap | null>(null);
  if (!trapRef.current) trapRef.current = new JFocusTrap();

  useEffect(() => {
    const trap = trapRef.current!;
    const panel = panelRef.current;
    if (active && panel) trap.activate(panel);
    else if (!active) trap.release();
  }, [active, panelRef]);

  // Unmounted while open (e.g. route change): still give focus back.
  useEffect(() => () => trapRef.current?.release(), []);

  return useCallback((event: React.KeyboardEvent<HTMLElement>) => {
    const panel = panelRef.current;
    if (panel) trapRef.current!.handleKeyDown(event, panel);
  }, [panelRef]);
}

/**
 * Popup menu closing rules (D9). Internal: consumed by Impl layers only.
 *
 * Unlike JDropdown, the menu does not listen to `document` keys. Esc is
 * handled on the menu's own root with `preventDefault` + `stopPropagation`,
 * so a dialog beneath (which listens on `document`) stays open. An outside
 * `pointerdown` closes the menu.
 */
import type React from 'react';
import { useCallback, useEffect, useRef } from 'react';

export type MenuCloseReason = 'escape' | 'outside';

export interface MenuPopupOptions {
  open: boolean;
  /** The element that holds the trigger and the menu: presses inside it never close. */
  rootRef: React.RefObject<HTMLElement>;
  /** Focus returns here when Esc closes the menu. */
  triggerRef?: React.RefObject<HTMLElement>;
  onClose: (reason: MenuCloseReason) => void;
}

export interface MenuPopup {
  /** Attach to the root element's `onKeyDown`. */
  onKeyDown: (event: React.KeyboardEvent) => void;
}

export function useMenuPopup({ open, rootRef, triggerRef, onClose }: MenuPopupOptions): MenuPopup {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return undefined;
    const doc = rootRef.current?.ownerDocument ?? document;
    const onPointerDown = (event: Event) => {
      const root = rootRef.current;
      if (root && event.target instanceof Node && root.contains(event.target)) return;
      onCloseRef.current('outside');
    };
    doc.addEventListener('pointerdown', onPointerDown);
    return () => doc.removeEventListener('pointerdown', onPointerDown);
  }, [open, rootRef]);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (!open || event.key !== 'Escape') return;
      event.preventDefault();
      event.stopPropagation();
      onCloseRef.current('escape');
      triggerRef?.current?.focus();
    },
    [open, triggerRef],
  );

  return { onKeyDown };
}

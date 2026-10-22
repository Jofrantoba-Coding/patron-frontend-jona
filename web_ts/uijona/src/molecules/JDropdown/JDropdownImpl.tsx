// JDropdownImpl.tsx — JONA Implementation (gestiona estado y posición)
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { InterJDropdown, JDROPDOWN_DEFAULTS } from './InterJDropdown';
import { JDropdownView } from './JDropdownView';
import { computeFloatingPosition, floatingStyle } from '../../lib/floating';

export const JDropdownImpl: React.FC<InterJDropdown> = ({
  align = JDROPDOWN_DEFAULTS.align, onOpen, onClose, onItemSelect, ...props
}) => {
  const [open, setOpen]           = useState(false);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const menuRef    = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;

  // Opens below the trigger, or above it when the viewport has no room below
  // (lower half of a phone screen). Uses the measured menu height once rendered.
  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect        = triggerRef.current.getBoundingClientRect();
    const vPad        = 8;
    const viewport    = { width: window.innerWidth, height: window.innerHeight };
    const width       = Math.min(Math.max(rect.width, 160), viewport.width - vPad * 2);
    const height      = menuRef.current?.getBoundingClientRect().height || 0;
    const desiredLeft = align === 'end' ? rect.right - width : rect.left;
    const position    = computeFloatingPosition(
      { top: rect.top, bottom: rect.bottom, left: desiredLeft, width: rect.width },
      { width, height },
      viewport,
      { margin: vPad },
    );
    setMenuStyle({ ...floatingStyle(position, { width }), maxWidth: `calc(100vw - ${vPad * 2}px)` });
  };

  // Re-measure once the menu is in the DOM (its real height may change the side)
  useLayoutEffect(() => { if (open) updatePosition(); }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey   = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); onClose?.(); }
    };
    const onClick = (e: MouseEvent) => {
      if (
        !triggerRef.current?.contains(e.target as Node) &&
        !menuRef.current?.contains(e.target as Node)
      ) { setOpen(false); onClose?.(); }
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open, onClose]);

  return (
    <JDropdownView
      {...props}
      align={align}
      onOpen={onOpen}
      onClose={onClose}
      onItemSelect={onItemSelect}
      open={open}
      menuStyle={menuStyle}
      triggerRef={triggerRef}
      menuRef={menuRef}
      onTriggerClick={() => {
        updatePosition();
        setOpen((v) => {
          const next = !v;
          if (next) onOpen?.(); else onClose?.();
          return next;
        });
      }}
      onItemClick={(item) => {
        item.onClick?.();
        onItemSelect?.(item.label);
        setOpen(false);
        onClose?.();
      }}
    />
  );
};

JDropdownImpl.displayName = 'JDropdown';

// JDropdownImpl.tsx — JONA Implementation (gestiona estado y posición)
import React, { useEffect, useRef, useState } from 'react';
import { InterJDropdown, JDROPDOWN_DEFAULTS } from './InterJDropdown';
import { JDropdownView } from './JDropdownView';

export const JDropdownImpl: React.FC<InterJDropdown> = ({
  align = JDROPDOWN_DEFAULTS.align, onOpen, onClose, onItemSelect, ...props
}) => {
  const [open, setOpen]           = useState(false);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const menuRef    = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;

  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect            = triggerRef.current.getBoundingClientRect();
    const vPad            = 8;
    const vw              = window.innerWidth;
    const width           = Math.min(Math.max(rect.width, 160), vw - vPad * 2);
    const desiredLeft     = align === 'end' ? rect.right - width : rect.left;
    const left            = Math.min(Math.max(desiredLeft, vPad), vw - width - vPad);
    setMenuStyle({
      position: 'fixed',
      top:      rect.bottom + 4,
      left,
      width,
      maxWidth: `calc(100vw - ${vPad * 2}px)`,
      zIndex:   50,
    });
  };

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

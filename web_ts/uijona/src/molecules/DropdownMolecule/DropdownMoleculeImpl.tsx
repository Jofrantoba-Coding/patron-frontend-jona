// DropdownMoleculeImpl.tsx — JONA Implementation (gestiona estado y posición)
import React, { useEffect, useRef, useState } from 'react';
import { InterDropdownMolecule } from './InterDropdownMolecule';
import { DropdownMoleculeView } from './DropdownMoleculeView';

export const DropdownMoleculeImpl: React.FC<InterDropdownMolecule> = ({
  align = 'start', onOpen, onClose, onItemSelect, ...props
}) => {
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const menuRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;

  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setMenuStyle({
      position: 'fixed', top: rect.bottom + 4,
      ...(align === 'end' ? { right: window.innerWidth - rect.right } : { left: rect.left }),
      minWidth: rect.width, zIndex: 50,
    });
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); onClose?.(); } };
    const onClick = (e: MouseEvent) => {
      if (!triggerRef.current?.contains(e.target as Node) && !menuRef.current?.contains(e.target as Node)) {
        setOpen(false); onClose?.();
      }
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('mousedown', onClick); };
  }, [open, onClose]);

  return (
    <DropdownMoleculeView
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
        setOpen((v) => { const next = !v; if (next) onOpen?.(); else onClose?.(); return next; });
      }}
      onItemClick={(item) => { item.onClick?.(); onItemSelect?.(item.label); setOpen(false); onClose?.(); }}
    />
  );
};

DropdownMoleculeImpl.displayName = 'DropdownMolecule';

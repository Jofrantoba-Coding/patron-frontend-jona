// PopoverMoleculeImpl.tsx — JONA Implementation
import React, { useEffect, useRef, useState } from 'react';
import { InterPopoverMolecule, POPOVER_MOLECULE_DEFAULTS } from './InterPopoverMolecule';
import { PopoverMoleculeView } from './PopoverMoleculeView';

export const PopoverMoleculeImpl: React.FC<InterPopoverMolecule> = (props) => {
  const merged = { ...POPOVER_MOLECULE_DEFAULTS, ...props };
  const [open, setOpen] = useState(false);
  const [panelStyle, setPanelStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const panelRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const vp = 8;

  const updatePosition = () => {
    if (!triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let top: number;
    let left: number;

    if (merged.side === 'bottom') top = r.bottom + 4;
    else if (merged.side === 'top') top = r.top - 4;
    else top = r.top;

    if (merged.side === 'right') left = r.right + 4;
    else if (merged.side === 'left') left = r.left - 4;
    else if (merged.align === 'end') left = r.right;
    else if (merged.align === 'center') left = r.left + r.width / 2;
    else left = r.left;

    left = Math.min(Math.max(left, vp), vw - vp);

    setPanelStyle({
      position: 'fixed',
      top: merged.side === 'top' ? undefined : top,
      bottom: merged.side === 'top' ? vh - top : undefined,
      left,
      transform: merged.align === 'center' ? 'translateX(-50%)' : merged.align === 'end' ? 'translateX(-100%)' : undefined,
      zIndex: 50,
    });
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); props.onClose?.(); } };
    const onClick = (e: MouseEvent) => {
      if (!triggerRef.current?.contains(e.target as Node) && !panelRef.current?.contains(e.target as Node)) {
        setOpen(false); props.onClose?.();
      }
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
  }, [open]);

  return (
    <PopoverMoleculeView
      trigger={props.trigger}
      open={open}
      panelStyle={panelStyle}
      triggerRef={triggerRef}
      panelRef={panelRef}
      className={props.className}
      onTriggerClick={() => {
        updatePosition();
        setOpen((v) => { const next = !v; if (next) props.onOpen?.(); else props.onClose?.(); return next; });
      }}
    >
      {props.children}
    </PopoverMoleculeView>
  );
};

PopoverMoleculeImpl.displayName = 'PopoverMolecule';

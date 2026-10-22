// JPopoverImpl.tsx — JONA Implementation
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { InterJPopover, JPOPOVER_DEFAULTS } from './InterJPopover';
import { JPopoverView } from './JPopoverView';
import { computeFloatingPosition, floatingStyle } from '../../lib/floating';

/** Matches the panel's CSS min width: min-w-[12rem]. */
const PANEL_MIN_WIDTH = 192;

export const JPopoverImpl: React.FC<InterJPopover> = (props) => {
  const merged = { ...JPOPOVER_DEFAULTS, ...props };
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

    // Top/bottom: resolve the alignment against the measured panel width, keep
    // it inside the viewport and flip to the other side when it has no room.
    if (merged.side === 'top' || merged.side === 'bottom') {
      const panel = panelRef.current?.getBoundingClientRect();
      const width = Math.min(panel?.width || PANEL_MIN_WIDTH, vw - vp * 2);
      const desiredLeft = merged.align === 'end'
        ? r.right - width
        : merged.align === 'center' ? r.left + r.width / 2 - width / 2 : r.left;
      const position = computeFloatingPosition(
        { top: r.top, bottom: r.bottom, left: desiredLeft, width: r.width },
        { width, height: panel?.height || 0 },
        { width: vw, height: vh },
        { margin: vp, prefer: merged.side },
      );
      setPanelStyle(floatingStyle(position));
      return;
    }

    // Left/right: unchanged placement next to the trigger.
    const left = Math.min(Math.max(merged.side === 'right' ? r.right + 4 : r.left - 4, vp), vw - vp);

    setPanelStyle({
      position: 'fixed',
      top: r.top,
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

  // Re-measure once the panel is in the DOM (real size may change side and offset)
  useLayoutEffect(() => { if (open) updatePosition(); }, [open]);

  return (
    <JPopoverView
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
    </JPopoverView>
  );
};

JPopoverImpl.displayName = 'JPopover';

// TooltipMoleculeImpl.tsx — JONA Implementation (gestiona estado y posición)
import React, { useRef, useState } from 'react';
import { InterTooltipMolecule, TooltipSide, TOOLTIP_MOLECULE_DEFAULTS } from './InterTooltipMolecule';
import { TooltipMoleculeView } from './TooltipMoleculeView';

function computeStyle(triggerRef: React.RefObject<HTMLSpanElement | null>, side: TooltipSide): React.CSSProperties {
  if (!triggerRef.current) return {};
  const r = triggerRef.current.getBoundingClientRect();
  const GAP = 6;
  const PADDING = 8;
  const maxWidth = Math.min(320, window.innerWidth - PADDING * 2);
  const halfWidth = maxWidth / 2;
  const centerX = Math.min(Math.max(r.left + r.width / 2, PADDING + halfWidth), window.innerWidth - PADDING - halfWidth);
  const centerY = Math.min(Math.max(r.top + r.height / 2, PADDING), window.innerHeight - PADDING);
  const base: React.CSSProperties = { position: 'fixed', zIndex: 9999, maxWidth: `calc(100vw - ${PADDING * 2}px)` };
  switch (side) {
    case 'top':    return { ...base, bottom: window.innerHeight - r.top + GAP, left: centerX, transform: 'translateX(-50%)' };
    case 'bottom': return { ...base, top: r.bottom + GAP, left: centerX, transform: 'translateX(-50%)' };
    case 'left': {
      const right = Math.min(Math.max(window.innerWidth - r.left + GAP, PADDING), window.innerWidth - PADDING - maxWidth);
      return { ...base, top: centerY, right, transform: 'translateY(-50%)' };
    }
    case 'right': {
      const left = Math.min(Math.max(r.right + GAP, PADDING), window.innerWidth - PADDING - maxWidth);
      return { ...base, top: centerY, left, transform: 'translateY(-50%)' };
    }
  }
}

export const TooltipMoleculeImpl: React.FC<InterTooltipMolecule> = ({
  onShow, onHide, ...props
}) => {
  const resolved = { ...TOOLTIP_MOLECULE_DEFAULTS, ...props };
  const [visible, setVisible] = useState(false);
  const [style, setStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLSpanElement>(null) as React.RefObject<HTMLSpanElement>;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => { timerRef.current = setTimeout(() => { setStyle(computeStyle(triggerRef, resolved.side)); setVisible(true); onShow?.(); }, resolved.delayMs); };
  const hide = () => { if (timerRef.current) clearTimeout(timerRef.current); setVisible(false); onHide?.(); };

  return (
    <TooltipMoleculeView
      {...resolved}
      visible={visible}
      style={style}
      triggerRef={triggerRef}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    />
  );
};

TooltipMoleculeImpl.displayName = 'TooltipMolecule';

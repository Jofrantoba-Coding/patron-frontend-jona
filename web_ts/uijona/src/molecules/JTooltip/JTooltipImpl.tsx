// JTooltipImpl.tsx — JONA Implementation
import React, { useEffect, useId, useRef, useState } from 'react';
import { InterJTooltip, JTooltipSide, JTOOLTIP_DEFAULTS } from './InterJTooltip';
import { JTooltipView } from './JTooltipView';

const GAP     = 6;
const PADDING = 8;

function computeStyle(
  ref: React.RefObject<HTMLSpanElement | null>,
  side: JTooltipSide,
): React.CSSProperties {
  if (!ref.current) return {};
  const r        = ref.current.getBoundingClientRect();
  const maxWidth = Math.min(320, window.innerWidth - PADDING * 2);
  const centerX  = Math.min(
    Math.max(r.left + r.width / 2, PADDING + maxWidth / 2),
    window.innerWidth - PADDING - maxWidth / 2,
  );
  const centerY = r.top + r.height / 2;
  const base: React.CSSProperties = {
    position: 'fixed',
    zIndex: 9999,
    maxWidth: `${maxWidth}px`,
  };

  switch (side) {
    case 'top':
      return { ...base, bottom: window.innerHeight - r.top + GAP, left: centerX, transform: 'translateX(-50%)' };
    case 'bottom':
      return { ...base, top: r.bottom + GAP, left: centerX, transform: 'translateX(-50%)' };
    case 'left': {
      // right: distancia desde borde derecho del viewport al borde derecho del tooltip
      const right = Math.max(window.innerWidth - r.left + GAP, PADDING);
      return { ...base, top: centerY, right, transform: 'translateY(-50%)' };
    }
    case 'right': {
      const left = Math.min(r.right + GAP, window.innerWidth - PADDING - maxWidth);
      return { ...base, top: centerY, left, transform: 'translateY(-50%)' };
    }
  }
}

export const JTooltipImpl: React.FC<InterJTooltip> = ({ onShow, onHide, ...props }) => {
  const resolved = { ...JTOOLTIP_DEFAULTS, ...props };
  const tooltipId = useId();

  const [visible, setVisible]   = useState(false);
  const [style, setStyle]       = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLSpanElement>(null) as React.RefObject<HTMLSpanElement>;
  const timerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    timerRef.current = setTimeout(() => {
      setStyle(computeStyle(triggerRef, resolved.side));
      setVisible(true);
      onShow?.();
    }, resolved.delayMs);
  };

  const hide = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(false);
    onHide?.();
  };

  // Cerrar con Escape
  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') hide(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [visible]);

  return (
    <JTooltipView
      {...resolved}
      tooltipId={tooltipId}
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

JTooltipImpl.displayName = 'JTooltip';

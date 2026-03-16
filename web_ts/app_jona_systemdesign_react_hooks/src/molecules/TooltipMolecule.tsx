// TooltipMolecule.tsx — Level 2: Molecule
// Observer pattern: props extends InterEventsTooltipMolecule (event contract).
import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../lib/cn';
import { InterEventsTooltipMolecule } from './events/InterEventsTooltipMolecule';

type TooltipSide = 'top' | 'bottom' | 'left' | 'right';

interface TooltipMoleculeProps extends InterEventsTooltipMolecule {
  content: React.ReactNode;
  side?: TooltipSide;
  delayMs?: number;
  className?: string;
  children: React.ReactElement;
}

export const TooltipMolecule: React.FC<TooltipMoleculeProps> = ({
  content,
  side = 'top',
  delayMs = 300,
  className,
  children,
  onShow,
  onHide,
}) => {
  const [visible, setVisible] = useState(false);
  const [style, setStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLSpanElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const GAP = 6;

  const computeStyle = (): React.CSSProperties => {
    if (!triggerRef.current) return {};
    const r = triggerRef.current.getBoundingClientRect();
    const base: React.CSSProperties = { position: 'fixed', zIndex: 9999 };
    switch (side) {
      case 'top':
        return { ...base, bottom: window.innerHeight - r.top + GAP, left: r.left + r.width / 2, transform: 'translateX(-50%)' };
      case 'bottom':
        return { ...base, top: r.bottom + GAP, left: r.left + r.width / 2, transform: 'translateX(-50%)' };
      case 'left':
        return { ...base, top: r.top + r.height / 2, right: window.innerWidth - r.left + GAP, transform: 'translateY(-50%)' };
      case 'right':
        return { ...base, top: r.top + r.height / 2, left: r.right + GAP, transform: 'translateY(-50%)' };
    }
  };

  const show = () => {
    timerRef.current = setTimeout(() => {
      setStyle(computeStyle());
      setVisible(true);
      onShow?.();
    }, delayMs);
  };

  const hide = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(false);
    onHide?.();
  };

  return (
    <>
      <span
        ref={triggerRef}
        className="inline-flex"
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
      >
        {children}
      </span>

      {visible &&
        createPortal(
          <div
            role="tooltip"
            style={style}
            className={cn(
              'max-w-xs rounded-token-sm bg-neutral-900 px-2.5 py-1.5 text-xs text-white shadow-md',
              'pointer-events-none select-none',
              className
            )}
          >
            {content}
          </div>,
          document.body
        )}
    </>
  );
};

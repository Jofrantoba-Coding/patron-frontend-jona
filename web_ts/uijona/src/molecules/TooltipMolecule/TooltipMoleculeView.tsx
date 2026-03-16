// TooltipMoleculeView.tsx — JONA View (render puro)
import React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../lib/cn';
import { InterTooltipMolecule } from './InterTooltipMolecule';

interface TooltipMoleculeViewProps extends InterTooltipMolecule {
  visible: boolean;
  style: React.CSSProperties;
  triggerRef: React.RefObject<HTMLSpanElement>;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onFocus: () => void;
  onBlur: () => void;
}

export const TooltipMoleculeView: React.FC<TooltipMoleculeViewProps> = ({
  content, className, children, visible, style, triggerRef,
  onMouseEnter, onMouseLeave, onFocus, onBlur,
}) => (
  <>
    <span ref={triggerRef} className="inline-flex" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onFocus={onFocus} onBlur={onBlur}>
      {children}
    </span>
    {visible && createPortal(
      <div role="tooltip" style={style} className={cn('max-w-xs rounded bg-neutral-900 px-2.5 py-1.5 text-xs text-white shadow-md pointer-events-none select-none', className)}>
        {content}
      </div>,
      document.body
    )}
  </>
);

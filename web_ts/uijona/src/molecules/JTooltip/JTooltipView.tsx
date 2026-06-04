// JTooltipView.tsx — JONA View (render puro)
import React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../lib/cn';
import { InterJTooltip } from './InterJTooltip';

export interface JTooltipViewProps extends InterJTooltip {
  tooltipId:    string;
  visible:      boolean;
  style:        React.CSSProperties;
  triggerRef:   React.RefObject<HTMLSpanElement>;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onFocus:      () => void;
  onBlur:       () => void;
}

export const JTooltipView: React.FC<JTooltipViewProps> = ({
  tooltipId, content, className, children, visible, style, triggerRef,
  onMouseEnter, onMouseLeave, onFocus, onBlur,
}) => (
  <>
    {/* Wrapper del trigger: propaga aria-describedby al tooltip */}
    <span
      ref={triggerRef}
      className="inline-flex"
      aria-describedby={visible ? tooltipId : undefined}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      {children}
    </span>

    {/* Tooltip: div nativo — evita CSS variables de JPanel que rompen el layout */}
    {visible && createPortal(
      <div
        id={tooltipId}
        role="tooltip"
        style={style}
        className={cn(
          'pointer-events-none select-none break-words rounded bg-neutral-900',
          'px-2.5 py-1.5 text-xs text-white shadow-md',
          className,
        )}
      >
        {content}
      </div>,
      document.body,
    )}
  </>
);

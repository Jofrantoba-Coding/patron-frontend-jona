// JPopoverView.tsx — JONA View (render puro)
import React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../lib/cn';
import { JPanel } from '../../atoms/JPanel/JPanel';

interface JPopoverViewProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  open: boolean;
  panelStyle: React.CSSProperties;
  triggerRef: React.RefObject<HTMLDivElement>;
  panelRef: React.RefObject<HTMLDivElement>;
  className?: string;
  onTriggerClick: () => void;
}

export const JPopoverView: React.FC<JPopoverViewProps> = ({
  trigger, children, open, panelStyle, triggerRef, panelRef, className, onTriggerClick,
}) => (
  <>
    <JPanel variant="ghost" padding="none" radius="none" ref={triggerRef} className="inline-block" onClick={onTriggerClick}>
      {trigger}
    </JPanel>
    {open && createPortal(
      <JPanel variant="ghost" padding="none" radius="none"
        ref={panelRef}
        role="dialog"
        style={panelStyle}
        className={cn(
          'z-50 min-w-[12rem] max-w-[calc(100vw-1rem)] rounded-md border border-neutral-200 bg-white p-3 shadow-lg',
          className
        )}
      >
        {children}
      </JPanel>,
      document.body
    )}
  </>
);

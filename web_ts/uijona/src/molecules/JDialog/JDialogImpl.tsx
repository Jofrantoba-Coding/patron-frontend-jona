// JDialogImpl.tsx — JONA Implementation
import React, { useEffect, useRef } from 'react';
import { InterJDialog, JDIALOG_DEFAULTS } from './InterJDialog';
import { JDialogView } from './JDialogView';

export const JDialogImpl: React.FC<InterJDialog> = ({
  open, onClose, onOpened, onClosed, onCancel, ...props
}) => {
  const resolved   = { ...JDIALOG_DEFAULTS, ...props };
  const overlayRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const dialogRef  = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      if (!wasOpenRef.current) onOpened?.();
      wasOpenRef.current = true;
      return () => { document.body.style.overflow = ''; };
    }

    document.body.style.overflow = '';
    if (!wasOpenRef.current) return undefined;

    wasOpenRef.current = false;
    if (onClosed) {
      const id = requestAnimationFrame(() => onClosed());
      return () => cancelAnimationFrame(id);
    }
    return undefined;
  }, [open, onOpened, onClosed]);

  useEffect(() => { if (open) dialogRef.current?.focus(); }, [open]);

  return (
    <JDialogView
      {...resolved}
      open={open}
      onClose={onClose}
      overlayRef={overlayRef}
      dialogRef={dialogRef}
      onOverlayClick={() => onClose?.()}
      onCloseClick={() => { onCancel?.(); onClose?.(); }}
    />
  );
};

JDialogImpl.displayName = 'JDialog';

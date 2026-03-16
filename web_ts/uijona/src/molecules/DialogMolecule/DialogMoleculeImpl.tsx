// DialogMoleculeImpl.tsx — JONA Implementation (gestiona efectos y refs)
import React, { useEffect, useRef } from 'react';
import { InterDialogMolecule, DIALOG_MOLECULE_DEFAULTS } from './InterDialogMolecule';
import { DialogMoleculeView } from './DialogMoleculeView';

export const DialogMoleculeImpl: React.FC<InterDialogMolecule> = ({
  open, onClose, onOpened, onClosed, onCancel, ...props
}) => {
  const resolved = { ...DIALOG_MOLECULE_DEFAULTS, ...props };
  const overlayRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const dialogRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  useEffect(() => {
    if (open) { document.body.style.overflow = 'hidden'; onOpened?.(); }
    else {
      document.body.style.overflow = '';
      if (onClosed) { const id = requestAnimationFrame(() => onClosed?.()); return () => cancelAnimationFrame(id); }
    }
    return () => { document.body.style.overflow = ''; };
  }, [open, onOpened, onClosed]);

  useEffect(() => { if (open) dialogRef.current?.focus(); }, [open]);

  return (
    <DialogMoleculeView
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

DialogMoleculeImpl.displayName = 'DialogMolecule';

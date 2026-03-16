// DialogMoleculeView.tsx — JONA View (render puro)
import React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../lib/cn';
import { ButtonAtom } from '../../atoms/ButtonAtom';
import { InterDialogMolecule } from './InterDialogMolecule';

interface DialogMoleculeViewProps extends InterDialogMolecule {
  overlayRef: React.RefObject<HTMLDivElement>;
  dialogRef: React.RefObject<HTMLDivElement>;
  onOverlayClick: () => void;  onCloseClick: () => void;
}

export const DialogMoleculeView: React.FC<DialogMoleculeViewProps> = ({
  open, title, description, showCloseButton = true, className, children, footer,
  overlayRef, dialogRef, onOverlayClick, onCloseClick,
}) => {
  if (!open) return null;
  return createPortal(
    <div ref={overlayRef} role="presentation" className="fixed inset-0 z-50 flex items-center justify-center" onClick={onOverlayClick}>
      <div className="absolute inset-0 bg-black/50" aria-hidden="true" />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'dialog-title' : undefined}
        aria-describedby={description ? 'dialog-desc' : undefined}
        tabIndex={-1}
        className={cn('relative z-10 w-full max-w-md bg-white rounded-lg shadow-xl p-6 flex flex-col gap-4 focus:outline-none', className)}
      >
        {(title || showCloseButton) && (
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              {title && <h2 id="dialog-title" className="text-lg font-semibold text-neutral-900 leading-none">{title}</h2>}
              {description && <p id="dialog-desc" className="text-sm text-neutral-500">{description}</p>}
            </div>
            {showCloseButton && (
              <ButtonAtom variant="ghost" size="icon" onClick={onCloseClick} aria-label="Close dialog" className="shrink-0 -mt-1 -mr-1">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </ButtonAtom>
            )}
          </div>
        )}
        {children && <div className="text-sm text-neutral-700">{children}</div>}
        {footer && <div className="flex justify-end gap-2 pt-2">{footer}</div>}
      </div>
    </div>,
    document.body
  );
};

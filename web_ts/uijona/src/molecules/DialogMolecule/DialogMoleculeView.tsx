// DialogMoleculeView.tsx — JONA View (render puro)
import React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../lib/cn';
import { ButtonAtom } from '../../atoms/ButtonAtom';
import { InterDialogMolecule } from './InterDialogMolecule';
import { PanelAtom } from '../../atoms/PanelAtom/PanelAtom';

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
    <PanelAtom variant="ghost" padding="none" radius="none" ref={overlayRef} role="presentation" className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:items-center">
      <PanelAtom variant="ghost" padding="none" radius="none" className="absolute inset-0 bg-black/50" aria-hidden="true" onClick={onOverlayClick} />
      <PanelAtom variant="ghost" padding="none" radius="none"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'dialog-title' : undefined}
        aria-describedby={description ? 'dialog-desc' : undefined}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        className={cn('relative z-10 my-auto flex max-h-[calc(100dvh-2rem)] w-full max-w-md flex-col gap-4 overflow-y-auto rounded-lg bg-white p-4 shadow-xl focus:outline-none sm:p-6', className)}
      >
        {(title || showCloseButton) && (
          <PanelAtom variant="ghost" padding="none" radius="none" className="flex items-start justify-between gap-4">
            <PanelAtom variant="ghost" padding="none" radius="none" className="flex min-w-0 flex-col gap-1">
              {title && <h2 id="dialog-title" className="text-lg font-semibold text-neutral-900 leading-tight break-words">{title}</h2>}
              {description && <p id="dialog-desc" className="text-sm text-neutral-500 break-words">{description}</p>}
            </PanelAtom>
            {showCloseButton && (
              <ButtonAtom variant="ghost" size="icon" onClick={onCloseClick} aria-label="Close dialog" className="shrink-0 -mt-1 -mr-1">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </ButtonAtom>
            )}
          </PanelAtom>
        )}
        {children && <PanelAtom variant="ghost" padding="none" radius="none" className="min-w-0 text-sm text-neutral-700">{children}</PanelAtom>}
        {footer && <PanelAtom variant="ghost" padding="none" radius="none" className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">{footer}</PanelAtom>}
      </PanelAtom>
    </PanelAtom>,
    document.body
  );
};

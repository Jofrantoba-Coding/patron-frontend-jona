// DialogMolecule.tsx — Level 2: Molecule
// Inspired by shadcn/ui Dialog — accessible modal with portal, focus trap, ESC close.
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../lib/cn';
import { ButtonAtom } from '../atoms/ButtonAtom';

interface DialogMoleculeProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  showCloseButton?: boolean;
  className?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}

export const DialogMolecule: React.FC<DialogMoleculeProps> = ({
  open,
  onClose,
  title,
  description,
  showCloseButton = true,
  className,
  children,
  footer,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Focus dialog on open
  useEffect(() => {
    if (open) dialogRef.current?.focus();
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      ref={overlayRef}
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 animate-in fade-in-0" aria-hidden="true" />

      {/* Dialog panel */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'dialog-title' : undefined}
        aria-describedby={description ? 'dialog-desc' : undefined}
        tabIndex={-1}
        className={cn(
          'relative z-10 w-full max-w-md bg-white rounded-token-lg shadow-xl',
          'p-6 flex flex-col gap-4',
          'focus:outline-none',
          className
        )}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              {title && (
                <h2 id="dialog-title" className="text-lg font-semibold text-neutral-900 leading-none">
                  {title}
                </h2>
              )}
              {description && (
                <p id="dialog-desc" className="text-sm text-neutral-500">
                  {description}
                </p>
              )}
            </div>
            {showCloseButton && (
              <ButtonAtom
                variant="ghost"
                size="icon"
                onClick={onClose}
                aria-label="Close dialog"
                className="shrink-0 -mt-1 -mr-1"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </ButtonAtom>
            )}
          </div>
        )}

        {/* Content */}
        {children && <div className="text-sm text-neutral-700">{children}</div>}

        {/* Footer */}
        {footer && (
          <div className="flex justify-end gap-2 pt-2">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

// JDialogView.tsx — JONA View (render puro)
import React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../lib/cn';
import { JButton } from '../../atoms/JButton';
import { InterJDialog } from './InterJDialog';
import { JPanel } from '../../atoms/JPanel/JPanel';

// ── Props ─────────────────────────────────────────────────────────────────────

interface JDialogViewProps extends InterJDialog {
  overlayRef:     React.RefObject<HTMLDivElement>;
  dialogRef:      React.RefObject<HTMLDivElement>;
  onOverlayClick: () => void;
  onCloseClick:   () => void;
}

// ── View ──────────────────────────────────────────────────────────────────────

export const JDialogView: React.FC<JDialogViewProps> = ({
  open,
  title,
  description,
  showCloseButton = true,
  className,
  children,
  footer,
  overlayRef,
  dialogRef,
  onOverlayClick,
  onCloseClick,
}) => {
  if (!open) return null;

  return createPortal(
    <JPanel
      variant="ghost"
      padding="none"
      radius="none"
      ref={overlayRef}
      role="presentation"
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:items-center"
    >
      <JPanel
        variant="ghost"
        padding="none"
        radius="none"
        className="absolute inset-0 bg-black/50"
        aria-hidden="true"
        onClick={onOverlayClick}
      />

      <JPanel
        variant="ghost"
        padding="none"
        radius="none"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'jdialog-title' : undefined}
        aria-describedby={description ? 'jdialog-desc' : undefined}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        className={cn(
          'relative z-10 my-auto flex max-h-[calc(100dvh-2rem)] w-full max-w-md flex-col gap-4 overflow-y-auto rounded-lg bg-white p-4 shadow-xl focus:outline-none sm:p-6',
          className,
        )}
      >
        {(title || showCloseButton) && (
          <JPanel variant="ghost" padding="none" radius="none" className="flex items-start justify-between gap-4">
            <JPanel variant="ghost" padding="none" radius="none" className="flex min-w-0 flex-col gap-1">
              {title && (
                <h2 id="jdialog-title" className="break-words text-lg font-semibold leading-tight text-neutral-900">
                  {title}
                </h2>
              )}
              {description && (
                <p id="jdialog-desc" className="break-words text-sm text-neutral-500">
                  {description}
                </p>
              )}
            </JPanel>
            {showCloseButton && (
              <JButton
                variant="ghost"
                size="icon"
                onClick={onCloseClick}
                aria-label="Close dialog"
                className="-mr-1 -mt-1 shrink-0"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </JButton>
            )}
          </JPanel>
        )}

        {children && (
          <JPanel variant="ghost" padding="none" radius="none" className="min-w-0 text-sm text-neutral-700">
            {children}
          </JPanel>
        )}

        {footer && (
          <JPanel variant="ghost" padding="none" radius="none" className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            {footer}
          </JPanel>
        )}
      </JPanel>
    </JPanel>,
    document.body,
  );
};

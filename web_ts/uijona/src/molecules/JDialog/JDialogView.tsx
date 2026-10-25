// JDialogView.tsx — JONA View (render puro)
import React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../lib/cn';
import { JButton } from '../../atoms/JButton';
import { InterJDialog, JDialogSize } from './InterJDialog';
import { JPanel } from '../../atoms/JPanel/JPanel';

// ── Style maps ────────────────────────────────────────────────────────────────

const SIZE_CLASS: Record<JDialogSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

// ── Props ─────────────────────────────────────────────────────────────────────

interface JDialogViewProps extends InterJDialog {
  overlayRef:     React.RefObject<HTMLDivElement>;
  dialogRef:      React.RefObject<HTMLDivElement>;
  onPanelKeyDown: (e: React.KeyboardEvent<HTMLElement>) => void;
  onOverlayClick: () => void;
  onCloseClick:   () => void;
}

// ── View ──────────────────────────────────────────────────────────────────────

export const JDialogView: React.FC<JDialogViewProps> = ({
  open,
  title,
  description,
  titleIcon,
  showCloseButton = true,
  size            = 'md',
  className,
  titleBarClassName,
  contentClassName,
  footerClassName,
  children,
  footer,
  overlayRef,
  dialogRef,
  onPanelKeyDown,
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
      className="fixed inset-0 z-50 flex flex-row items-center justify-center p-2 sm:p-4"
    >
      {/* Backdrop */}
      <JPanel
        variant="ghost"
        padding="none"
        radius="none"
        className="absolute inset-0 bg-black/50"
        aria-hidden="true"
        onClick={onOverlayClick}
      />

      {/* Dialog window — flex column (JBoxLayout). A border-layout grid capped
          only by max-height may not shrink its 1fr row, so the content would not
          scroll on short phone screens; flex + min-h-0 does. */}
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
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onPanelKeyDown}
        className={cn(
          'relative z-10 flex w-full flex-col rounded-lg bg-white shadow-xl focus:outline-none overflow-hidden',
          'max-h-[calc(100dvh-1rem)] sm:max-h-[calc(100dvh-2rem)]',
          SIZE_CLASS[size],
          className,
        )}
      >
        {/* ── North: Barra de título ───────────────────────────────────── */}
        <div
          className={cn(
            'flex shrink-0 flex-row items-center bg-neutral-50 border-b border-neutral-200',
            titleBarClassName,
          )}
        >
          {/* West: ícono opcional */}
          {titleIcon && (
            <span className="flex items-center pl-3 pr-1 py-3 shrink-0 text-neutral-500">
              {titleIcon}
            </span>
          )}

          {/* Center: título + descripción */}
          <div
            className={cn(
              'flex min-w-0 flex-1 flex-col justify-center gap-0.5 py-3',
              titleIcon ? 'pl-1' : 'pl-4',
              showCloseButton ? 'pr-1' : 'pr-4',
            )}
          >
            {title && (
              <h2
                id="jdialog-title"
                className="truncate text-sm font-semibold text-neutral-900 leading-tight"
              >
                {title}
              </h2>
            )}
            {description && (
              <p
                id="jdialog-desc"
                className="break-words text-xs text-neutral-500 leading-snug"
              >
                {description}
              </p>
            )}
          </div>

          {/* East: botón cerrar */}
          {showCloseButton && (
            <span className="flex shrink-0 items-center px-2 py-2">
              <JButton
                variant="ghost"
                size="icon"
                onClick={onCloseClick}
                aria-label="Close dialog"
                className="h-11 w-11 sm:h-8 sm:w-8 sm:min-h-8 sm:min-w-8 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </JButton>
            </span>
          )}
        </div>

        {/* ── Center: Área de controles ────────────────────────────────── */}
        <JPanel
          variant="ghost"
          padding="none"
          radius="none"
          className={cn('min-h-0 min-w-0 flex-1 overflow-auto p-3 text-sm text-neutral-700 sm:p-4', contentClassName)}
        >
          {children}
        </JPanel>

        {/* ── South: Barra de botones (JFlowLayout) ─────────────────────── */}
        {footer && (
          <JPanel
            layout="flow"
            variant="ghost"
            padding="none"
            radius="none"
            justifyContent="end"
            gap="sm"
            className={cn(
              'flex shrink-0 flex-wrap px-4 py-3 bg-neutral-50 border-t border-neutral-200',
              footerClassName,
            )}
          >
            {footer}
          </JPanel>
        )}
      </JPanel>
    </JPanel>,
    document.body,
  );
};

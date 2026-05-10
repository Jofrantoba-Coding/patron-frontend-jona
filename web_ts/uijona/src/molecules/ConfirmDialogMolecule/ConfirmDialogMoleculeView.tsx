// ConfirmDialogMoleculeView.tsx — JONA View (render puro)
import React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../lib/cn';
import { ButtonAtom } from '../../atoms/ButtonAtom';
import { ConfirmDialogVariant } from './InterConfirmDialogMolecule';

const iconByVariant: Record<ConfirmDialogVariant, React.ReactNode> = {
  danger: (
    <svg className="h-6 w-6 text-danger-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    </svg>
  ),
  warning: (
    <svg className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" />
    </svg>
  ),
  info: (
    <svg className="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" />
    </svg>
  ),
};

const confirmVariantMap: Record<ConfirmDialogVariant, 'destructive' | 'default'> = {
  danger: 'destructive',
  warning: 'default',
  info: 'default',
};

interface ConfirmDialogMoleculeViewProps {
  open: boolean;
  title: string;
  description?: string;
  variant: ConfirmDialogVariant;
  confirmLabel: string;
  cancelLabel: string;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialogMoleculeView: React.FC<ConfirmDialogMoleculeViewProps> = ({
  open, title, description, variant, confirmLabel, cancelLabel, isLoading, onConfirm, onCancel,
}) => {
  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" aria-hidden="true" onClick={onCancel} />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby={description ? 'confirm-desc' : undefined}
        className="relative z-10 flex w-full max-w-sm flex-col gap-4 rounded-lg bg-white p-5 shadow-xl sm:max-w-md"
      >
        <div className="flex items-start gap-3">
          <div className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
            variant === 'danger' && 'bg-danger-50',
            variant === 'warning' && 'bg-yellow-50',
            variant === 'info' && 'bg-primary-50',
          )}>
            {iconByVariant[variant]}
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <h2 id="confirm-title" className="break-words text-base font-semibold text-neutral-900">{title}</h2>
            {description && <p id="confirm-desc" className="break-words text-sm text-neutral-500">{description}</p>}
          </div>
        </div>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <ButtonAtom variant="outline" onClick={onCancel} disabled={isLoading}>
            {cancelLabel}
          </ButtonAtom>
          <ButtonAtom variant={confirmVariantMap[variant]} onClick={onConfirm} loading={isLoading}>
            {confirmLabel}
          </ButtonAtom>
        </div>
      </div>
    </div>,
    document.body
  );
};

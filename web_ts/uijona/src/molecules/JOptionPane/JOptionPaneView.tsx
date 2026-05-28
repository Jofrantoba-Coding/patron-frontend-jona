// JOptionPaneView.tsx — JONA View (render puro)
import React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../lib/cn';
import { JButton } from '../../atoms/JButton';
import { JOptionPaneVariant } from './InterJOptionPane';
import { JPanel } from '../../atoms/JPanel/JPanel';

// ── Icons ─────────────────────────────────────────────────────────────────────

const iconByVariant: Record<JOptionPaneVariant, React.ReactNode> = {
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

const iconBg: Record<JOptionPaneVariant, string> = {
  danger:  'bg-danger-50',
  warning: 'bg-yellow-50',
  info:    'bg-primary-50',
};

const confirmVariant: Record<JOptionPaneVariant, 'destructive' | 'default'> = {
  danger:  'destructive',
  warning: 'default',
  info:    'default',
};

// ── Props ─────────────────────────────────────────────────────────────────────

interface JOptionPaneViewProps {
  open:         boolean;
  title:        string;
  description?: string;
  variant:      JOptionPaneVariant;
  confirmLabel: string;
  cancelLabel:  string;
  isLoading:    boolean;
  onConfirm:    () => void;
  onCancel:     () => void;
}

// ── View ──────────────────────────────────────────────────────────────────────

export const JOptionPaneView: React.FC<JOptionPaneViewProps> = ({
  open,
  title,
  description,
  variant,
  confirmLabel,
  cancelLabel,
  isLoading,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  return createPortal(
    <JPanel
      variant="ghost"
      padding="none"
      radius="none"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <JPanel
        variant="ghost"
        padding="none"
        radius="none"
        className="absolute inset-0 bg-black/50"
        aria-hidden="true"
        onClick={onCancel}
      />

      {/* Dialog window — BorderLayout: west=icon, center=texto, south=botones */}
      <JPanel
        layout="border"
        variant="ghost"
        padding="none"
        radius="none"
        alignItems="start"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="joptionpane-title"
        aria-describedby={description ? 'joptionpane-desc' : undefined}
        className="relative z-10 w-full max-w-sm rounded-lg bg-white shadow-xl sm:max-w-md"
      >
        {/* West: ícono con fondo semántico */}
        <JPanel
          area="left"
          variant="ghost"
          padding="none"
          radius="none"
          className="pl-5 pt-5 pr-3"
        >
          <div className={cn('flex h-10 w-10 items-center justify-center rounded-full', iconBg[variant])}>
            {iconByVariant[variant]}
          </div>
        </JPanel>

        {/* Center: título + descripción — div nativo para flex-col sin interferencia de JPanel */}
        <div
          data-panel-area="center"
          className="flex min-w-0 flex-col gap-1 pb-4 pr-5 pt-5"
        >
          <h2 id="joptionpane-title" className="break-words text-base font-semibold text-neutral-900">
            {title}
          </h2>
          {description && (
            <p id="joptionpane-desc" className="break-words text-sm text-neutral-500">
              {description}
            </p>
          )}
        </div>

        {/* South: botones — FlowLayout alineado izquierda, una sola línea */}
        <JPanel
          area="bottom"
          layout="flow"
          variant="ghost"
          padding="none"
          radius="none"
          justifyContent="start"
          gap="sm"
          className="px-5 pb-5"
        >
          <JButton variant={confirmVariant[variant]} onClick={onConfirm} loading={isLoading}>
            {confirmLabel}
          </JButton>
          <JButton variant="outline" onClick={onCancel} disabled={isLoading}>
            {cancelLabel}
          </JButton>
        </JPanel>
      </JPanel>
    </JPanel>,
    document.body,
  );
};

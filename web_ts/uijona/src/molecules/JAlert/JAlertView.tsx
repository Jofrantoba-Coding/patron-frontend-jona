// JAlertView.tsx — JONA View (render puro)
import React from 'react';
import { cn } from '../../lib/cn';
import { InterJAlert, JAlertVariant } from './InterJAlert';
import { JPanel } from '../../atoms/JPanel/JPanel';

// ── Style maps ────────────────────────────────────────────────────────────────

const VARIANT_CLASSES: Record<JAlertVariant, string> = {
  default: 'bg-neutral-50  border-neutral-200 text-neutral-900',
  info:    'bg-primary-50  border-primary-300  text-primary-800',
  success: 'bg-green-50    border-green-300    text-green-800',
  warning: 'bg-yellow-50   border-yellow-300   text-yellow-800',
  danger:  'bg-red-50      border-danger-500   text-danger-700',
};

const DISMISS_VARIANT_CLASSES: Record<JAlertVariant, string> = {
  default: 'text-neutral-400 hover:text-neutral-700',
  info:    'text-primary-400 hover:text-primary-700',
  success: 'text-green-400   hover:text-green-700',
  warning: 'text-yellow-500  hover:text-yellow-800',
  danger:  'text-danger-400  hover:text-danger-700',
};

// ── View ──────────────────────────────────────────────────────────────────────

export const JAlertView: React.FC<InterJAlert> = ({
  variant = 'default',
  title,
  icon,
  dismissible = false,
  onDismiss,
  className,
  children,
  ...props
}) => (
  <JPanel
    variant="ghost"
    padding="none"
    role="alert"
    className={cn(
      'relative w-full min-w-0 rounded-md border p-4',
      icon && 'pl-11',
      dismissible && 'pr-10',
      VARIANT_CLASSES[variant],
      className,
    )}
    {...props}
  >
    {icon && (
      <span className="absolute left-4 top-4 text-current" aria-hidden="true">
        {icon}
      </span>
    )}

    {dismissible && (
      <button
        type="button"
        aria-label="Cerrar alerta"
        onClick={onDismiss}
        className={cn(
          'absolute right-3 top-3 rounded p-0.5 transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current',
          DISMISS_VARIANT_CLASSES[variant],
        )}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    )}

    {title && (
      <h5 className="mb-1 break-words font-medium leading-tight tracking-tight">
        {title}
      </h5>
    )}

    {children && (
      <JPanel variant="ghost" padding="none" className="break-words text-sm [&_p]:leading-relaxed">
        {children}
      </JPanel>
    )}
  </JPanel>
);

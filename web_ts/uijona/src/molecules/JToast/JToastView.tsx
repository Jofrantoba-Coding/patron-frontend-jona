// JToastView.tsx — JONA View (render puro)
import React from 'react';
import { cn } from '../../lib/cn';
import { JToastVariant } from './InterJToast';

const variantClasses: Record<JToastVariant, string> = {
  default: 'bg-neutral-900 text-white',
  success: 'bg-success-600 text-white',
  warning: 'bg-warning-500 text-white',
  danger:  'bg-danger-500 text-white',
};

export interface JToastViewProps {
  id:               string;
  message:          string;
  title?:           string;
  variant?:         JToastVariant;
  className?:       string;
  onDismissClick?:  () => void;
}

export const JToastView: React.FC<JToastViewProps> = ({
  message, title, variant = 'default', className, onDismissClick,
}) => (
  <div
    role="status"
    aria-live="polite"
    className={cn(
      'flex w-full min-w-0 max-w-sm items-start gap-3 rounded-md px-4 py-3 shadow-lg sm:min-w-[240px]',
      variantClasses[variant],
      className,
    )}
  >
    <div className="min-w-0 flex-1">
      {title && (
        <span className="mb-1 block break-words text-sm font-semibold leading-none">
          {title}
        </span>
      )}
      <span className="block break-words text-sm leading-snug">
        {message}
      </span>
    </div>
    <button
      type="button"
      aria-label="Dismiss notification"
      onClick={onDismissClick}
      className="shrink-0 cursor-pointer rounded opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  </div>
);

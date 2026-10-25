// JToastView.tsx — JONA View (render puro)
import React from 'react';
import { cn } from '../../lib/cn';
import { JToastVariant } from './InterJToast';
import { INVERSE, ON_PRIMARY } from '../../theme/tokenClasses';

const variantClasses: Record<JToastVariant, string> = {
  default: INVERSE,
  success: `bg-success-600 ${ON_PRIMARY}`,
  warning: `bg-warning-500 ${ON_PRIMARY}`,
  danger:  `bg-danger-500 ${ON_PRIMARY}`,
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
    {/* 44px hit area on mobile; the negative margin keeps the toast's visual height. */}
    <button
      type="button"
      aria-label="Dismiss notification"
      onClick={onDismissClick}
      className="-m-3.5 inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current sm:m-0 sm:h-auto sm:w-auto"
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  </div>
);

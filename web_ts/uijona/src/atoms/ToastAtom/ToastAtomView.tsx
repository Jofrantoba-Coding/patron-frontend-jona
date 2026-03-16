// ToastAtomView.tsx — JONA View (render puro)
import React from 'react';
import { cn } from '../../lib/cn';
import { InterToastAtom, ToastVariant } from './InterToastAtom';

const variantClasses: Record<ToastVariant, string> = {
  default: 'bg-neutral-900 text-white',
  success: 'bg-success-600 text-white',
  warning: 'bg-warning-500 text-white',
  danger:  'bg-danger-500 text-white',
};

interface ToastAtomViewProps extends Omit<InterToastAtom, 'className'> {
  className?: string;
  onDismissClick?: () => void;
}

export const ToastAtomView: React.FC<ToastAtomViewProps> = ({
  message, title, variant = 'default', className, onDismissClick,
}) => (
  <div
    role="status"
    aria-live="polite"
    className={cn(
      'flex items-start gap-3 rounded-md px-4 py-3 shadow-lg min-w-[240px] max-w-sm',
      variantClasses[variant],
      className
    )}
  >
    <div className="flex-1 min-w-0">
      {title && <p className="text-sm font-semibold leading-none mb-1">{title}</p>}
      <p className="text-sm leading-snug">{message}</p>
    </div>
    <button
      type="button"
      aria-label="Dismiss notification"
      onClick={onDismissClick}
      className="shrink-0 opacity-70 hover:opacity-100 transition-opacity cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
    >
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  </div>
);

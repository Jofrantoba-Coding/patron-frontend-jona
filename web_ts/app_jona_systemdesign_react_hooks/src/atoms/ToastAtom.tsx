// ToastAtom.tsx — Level 1: Atom
// Single toast notification unit. Rendered by ToastMolecule provider.
import React from 'react';
import { cn } from '../lib/cn';

export type ToastVariant = 'default' | 'success' | 'destructive' | 'warning';

export interface ToastData {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number; // ms, default 4000
}

interface ToastAtomProps extends ToastData {
  onDismiss: (id: string) => void;
}

const variantClasses: Record<ToastVariant, string> = {
  default:     'bg-white border-neutral-200 text-neutral-900',
  success:     'bg-success-500 border-success-600 text-white',
  destructive: 'bg-danger-500 border-danger-600 text-white',
  warning:     'bg-yellow-400 border-yellow-500 text-yellow-900',
};

const iconMap: Record<ToastVariant, string> = {
  default:     'ℹ',
  success:     '✓',
  destructive: '✕',
  warning:     '⚠',
};

export const ToastAtom: React.FC<ToastAtomProps> = ({
  id, title, description, variant = 'default', onDismiss,
}) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex items-start gap-3 w-80 rounded-token-md border shadow-lg px-4 py-3',
        'animate-in slide-in-from-right-full',
        variantClasses[variant]
      )}
    >
      <span className="text-base leading-none mt-0.5 shrink-0" aria-hidden="true">
        {iconMap[variant]}
      </span>
      <div className="flex-1 min-w-0">
        {title && <p className="text-sm font-semibold leading-tight">{title}</p>}
        {description && <p className="text-xs mt-0.5 opacity-90">{description}</p>}
      </div>
      <button
        onClick={() => onDismiss(id)}
        aria-label="Dismiss notification"
        className="shrink-0 opacity-70 hover:opacity-100 transition-opacity text-sm leading-none"
      >
        ✕
      </button>
    </div>
  );
};

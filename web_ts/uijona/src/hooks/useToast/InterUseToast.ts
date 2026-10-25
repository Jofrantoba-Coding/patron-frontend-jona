// InterUseToast.ts — JONA Interface
import type React from 'react';
import { JToastPosition, JToastVariant } from '../../molecules/JToast';

export interface ToastData {
  id: string;
  message?: string;
  title?: string;
  variant?: JToastVariant;
  /** ms before auto-dismiss (4000); `0` keeps the toast until dismissed. */
  duration?: number;
}

export interface ToastProviderProps {
  children: React.ReactNode;
  /** 1.5.1 default `bottom-right`; `top-right` is recommended for data-entry apps (R-FBK-6). */
  position?: JToastPosition;
  /** Accessible name of the toast stack. */
  label?: string;
  /** Accessible name of every dismiss button. */
  dismissLabel?: string;
  /** Gap between the stack and the viewport edges. */
  offset?: string;
}

/** The 1.5.1 values, kept for compatibility (D17); apps override them through the props. */
export const TOAST_PROVIDER_DEFAULTS = {
  label: 'Notifications',
  dismissLabel: 'Dismiss notification',
  offset: '1rem',
} as const satisfies Required<Pick<ToastProviderProps, 'label' | 'dismissLabel' | 'offset'>>;

export interface InterUseToast {
  toast: (opts: Omit<ToastData, 'id'>) => void;
  dismiss: (id: string) => void;
}

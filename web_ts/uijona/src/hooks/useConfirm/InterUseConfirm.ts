// InterUseConfirm.ts — JONA Interface
import type React from 'react';
import type { InterJOptionPane, JOptionPaneInitialFocus, JOptionPaneVariant } from '../../molecules/JOptionPane';

export interface ConfirmOptions {
  title: string;
  description?: string;
  /** Record summary content, shown in the pane and part of its description. */
  details?: React.ReactNode;
  variant?: JOptionPaneVariant;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Omitted: `cancel` for `danger` (never one Enter away), `confirm` otherwise. */
  initialFocus?: JOptionPaneInitialFocus;
}

/** Resolves `true` when confirmed and `false` when declined (cancel, Esc, close, unmount). */
export type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

export interface ConfirmProviderProps {
  children: React.ReactNode;
  /**
   * Renders the pane in the host, which then owns Esc (for example to keep it
   * on a dialog stack). Without it the provider renders a `JOptionPane` and
   * intercepts Esc on the window capture phase while it is open (D9).
   */
  renderPane?: (pane: InterJOptionPane) => React.ReactNode;
}

export const CONFIRM_DEFAULTS = {
  variant: 'info',
  confirmLabel: 'Confirmar',
  cancelLabel: 'Cancelar',
} as const satisfies Required<Pick<ConfirmOptions, 'variant' | 'confirmLabel' | 'cancelLabel'>>;

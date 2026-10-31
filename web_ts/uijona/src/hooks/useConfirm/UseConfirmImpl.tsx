// UseConfirmImpl.tsx — JONA Implementation
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { InterJOptionPane } from '../../molecules/JOptionPane';
import { CONFIRM_DEFAULTS, ConfirmFn, ConfirmOptions, ConfirmProviderProps } from './InterUseConfirm';
import { UseConfirmView } from './UseConfirmView';

interface ConfirmRequest {
  id: number;
  options: ConfirmOptions;
  resolve: (answer: boolean) => void;
}

/** Pure: the JOptionPane props of one request, with CONFIRM_DEFAULTS and the focus rule applied. */
export function confirmPane(options: ConfirmOptions, onConfirm: () => void, onCancel: () => void): InterJOptionPane {
  const variant = options.variant ?? CONFIRM_DEFAULTS.variant;
  return {
    open: true,
    title: options.title,
    description: options.description,
    details: options.details,
    variant,
    confirmLabel: options.confirmLabel ?? CONFIRM_DEFAULTS.confirmLabel,
    cancelLabel: options.cancelLabel ?? CONFIRM_DEFAULTS.cancelLabel,
    initialFocus: options.initialFocus ?? (variant === 'danger' ? 'cancel' : 'confirm'),
    onConfirm,
    onCancel,
  };
}

const ConfirmContext = createContext<ConfirmFn | null>(null);

export const ConfirmProvider: React.FC<ConfirmProviderProps> = ({ children, renderPane }) => {
  const [queue, setQueue] = useState<ConfirmRequest[]>([]);
  const queueRef = useRef<ConfirmRequest[]>([]);
  const nextId = useRef(0);

  const update = (next: ConfirmRequest[]) => {
    queueRef.current = next;
    setQueue(next);
  };

  const confirm = useCallback<ConfirmFn>((options) => new Promise<boolean>((resolve) => {
    nextId.current += 1;
    update([...queueRef.current, { id: nextId.current, options, resolve }]);
  }), []);

  // Settles one request by id, so a late second click can never answer the next one.
  const settle = useCallback((id: number, answer: boolean) => {
    const request = queueRef.current.find((item) => item.id === id);
    if (!request) return;
    update(queueRef.current.filter((item) => item.id !== id));
    request.resolve(answer);
  }, []);

  const current = queue[0] ?? null;
  const currentId = current?.id ?? null;
  const hostOwnsEsc = !!renderPane;

  // D9: while a provider-rendered pane is open, Esc answers it and reaches nothing beneath.
  useEffect(() => {
    if (currentId === null || hostOwnsEsc) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      event.stopImmediatePropagation();
      settle(currentId, false);
    };
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [currentId, hostOwnsEsc, settle]);

  // Unmounting resolves every pending call with false.
  useEffect(() => () => {
    const pending = queueRef.current;
    queueRef.current = [];
    pending.forEach((request) => request.resolve(false));
  }, []);

  const pane = current
    ? confirmPane(current.options, () => settle(current.id, true), () => settle(current.id, false))
    : null;

  return (
    <ConfirmContext.Provider value={confirm}>
      <UseConfirmView pane={pane} paneKey={currentId} renderPane={renderPane}>
        {children}
      </UseConfirmView>
    </ConfirmContext.Provider>
  );
};

ConfirmProvider.displayName = 'ConfirmProvider';

export function useConfirm(): ConfirmFn {
  const confirm = useContext(ConfirmContext);
  if (!confirm) throw new Error('useConfirm must be used inside <ConfirmProvider>');
  return confirm;
}

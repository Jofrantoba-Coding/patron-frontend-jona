// useToast.tsx — Design System utility
// Global toast context + hook. Inspired by shadcn/ui useToast pattern.
import React, { createContext, useCallback, useContext, useState } from 'react';
import { ToastAtom, ToastData, ToastVariant } from '../atoms/ToastAtom';

// ── Context ──────────────────────────────────────────────────────────────────

interface ToastContextValue {
  toast: (opts: Omit<ToastData, 'id'>) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

// ── Provider ─────────────────────────────────────────────────────────────────

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ title, description, variant = 'default', duration = 4000 }: Omit<ToastData, 'id'>) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      setToasts((prev) => [...prev, { id, title, description, variant, duration }]);
      if (duration > 0) {
        setTimeout(() => dismiss(id), duration);
      }
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      {/* Toast viewport — fixed bottom-right */}
      <div
        aria-label="Notifications"
        className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none"
      >
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastAtom {...t} onDismiss={dismiss} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}

// ── Convenience helpers ───────────────────────────────────────────────────────

export function useToastHelpers() {
  const { toast } = useToast();
  return {
    success: (title: string, description?: string) =>
      toast({ title, description, variant: 'success' as ToastVariant }),
    error: (title: string, description?: string) =>
      toast({ title, description, variant: 'destructive' as ToastVariant }),
    warning: (title: string, description?: string) =>
      toast({ title, description, variant: 'warning' as ToastVariant }),
    info: (title: string, description?: string) =>
      toast({ title, description, variant: 'default' as ToastVariant }),
  };
}

// UseToastImpl.tsx — JONA Implementation
import React, { createContext, useCallback, useContext, useState } from 'react';
import { ToastAtom } from '../../atoms/ToastAtom';
import { ToastData, InterUseToast } from './InterUseToast';

const ToastContext = createContext<InterUseToast | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(({ title, message, variant = 'default', duration = 4000 }: Omit<ToastData, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts((prev) => [...prev, { id, title, message, variant, duration }]);
  }, []);

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <div aria-label="Notifications" className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastAtom {...t} onDismiss={dismiss} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export function useToast(): InterUseToast {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}

export function useToastHelpers() {
  const { toast } = useToast();
  return {
    success: (message: string, title?: string) => toast({ message, title, variant: 'success' }),
    error:   (message: string, title?: string) => toast({ message, title, variant: 'danger' }),
    warning: (message: string, title?: string) => toast({ message, title, variant: 'warning' }),
    info:    (message: string, title?: string) => toast({ message, title, variant: 'default' }),
  };
}

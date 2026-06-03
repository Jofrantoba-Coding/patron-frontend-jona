// UseToastImpl.tsx — JONA Implementation
import React, { createContext, useCallback, useContext, useState } from 'react';
import { JToast, JToastPosition, JTOAST_POSITION_DEFAULT } from '../../molecules/JToast';
import { ToastData, InterUseToast } from './InterUseToast';
import { cn } from '../../lib/cn';

const POSITION_CLASSES: Record<JToastPosition, string> = {
  'top-left':      'top-4 left-4',
  'top-center':    'top-4 left-1/2 -translate-x-1/2',
  'top-right':     'top-4 right-4',
  'center-left':   'top-1/2 -translate-y-1/2 left-4',
  'center':        'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  'center-right':  'top-1/2 -translate-y-1/2 right-4',
  'bottom-left':   'bottom-4 left-4',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  'bottom-right':  'bottom-4 right-4',
};

const ToastContext = createContext<InterUseToast | null>(null);

interface ToastProviderProps {
  children: React.ReactNode;
  position?: JToastPosition;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children, position = JTOAST_POSITION_DEFAULT }) => {
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
      <div
        aria-label="Notifications"
        className={cn(
          'pointer-events-none fixed z-[100] flex w-80 flex-col gap-2',
          POSITION_CLASSES[position],
        )}
      >
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <JToast {...t} onDismiss={dismiss} />
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

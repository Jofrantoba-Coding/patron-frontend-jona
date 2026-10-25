// UseToastImpl.tsx — JONA Implementation
import React, { createContext, useCallback, useContext, useState } from 'react';
import { JToast, JToastPosition, JTOAST_POSITION_DEFAULT } from '../../molecules/JToast';
import { ToastData, InterUseToast, ToastProviderProps, TOAST_PROVIDER_DEFAULTS } from './InterUseToast';
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

/** The viewport edges each position is offset from. */
const OFFSET_SIDES: Record<JToastPosition, ('top' | 'right' | 'bottom' | 'left')[]> = {
  'top-left':      ['top', 'left'],
  'top-center':    ['top'],
  'top-right':     ['top', 'right'],
  'center-left':   ['left'],
  'center':        [],
  'center-right':  ['right'],
  'bottom-left':   ['bottom', 'left'],
  'bottom-center': ['bottom'],
  'bottom-right':  ['bottom', 'right'],
};

/** Pure: inline geometry for a non-default offset (D4); the default keeps the 1.5.1 classes alone. */
export function toastOffsetStyle(position: JToastPosition, offset: string): React.CSSProperties | undefined {
  if (offset === TOAST_PROVIDER_DEFAULTS.offset) return undefined;
  const style: React.CSSProperties = { maxWidth: `calc(100vw - 2 * ${offset})` };
  OFFSET_SIDES[position].forEach((side) => { style[side] = offset; });
  return style;
}

const ToastContext = createContext<InterUseToast | null>(null);

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  position = JTOAST_POSITION_DEFAULT,
  label = TOAST_PROVIDER_DEFAULTS.label,
  dismissLabel = TOAST_PROVIDER_DEFAULTS.dismissLabel,
  offset = TOAST_PROVIDER_DEFAULTS.offset,
}) => {
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
        aria-label={label}
        style={toastOffsetStyle(position, offset)}
        className={cn(
          // Phone: viewport width minus the 1rem gutters of every position; 20rem from sm:.
          'pointer-events-none fixed z-[100] flex w-[calc(100vw-2rem)] flex-col gap-2 sm:w-80',
          POSITION_CLASSES[position],
        )}
      >
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <JToast {...t} dismissLabel={dismissLabel} onDismiss={dismiss} />
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

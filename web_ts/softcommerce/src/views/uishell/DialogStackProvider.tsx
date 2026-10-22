// Layer: shell service. Makes Esc close only the topmost dialog (R-SHELL-6).
// jona-ui dialogs each listen to Esc on `document`, so one key press would close every open one.
import { JOptionPane, type InterJOptionPane } from 'jona-ui';
import { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, type ReactNode } from 'react';
import { EMPTY_DIALOG_STACK, pushDialog, removeDialog, topDialog, type DialogStack } from '../../domain/dialogStack';

interface DialogStackApi {
  register(id: string): () => void;
  /** True unless an Esc is being dispatched whose topmost dialog is another one. */
  mayClose(id: string): boolean;
}

const DialogStackContext = createContext<DialogStackApi | null>(null);

export function DialogStackProvider({ children }: { children: ReactNode }) {
  const stack = useRef<DialogStack>(EMPTY_DIALOG_STACK);
  // Top dialog at the start of the current Esc dispatch; `undefined` outside of one.
  const escTop = useRef<string | undefined>(undefined);

  useEffect(() => {
    // Capture phase: runs before any dialog listener, so the snapshot predates every close.
    const snapshot = (event: KeyboardEvent) => {
      if (event.key === 'Escape') escTop.current = topDialog(stack.current);
    };
    // Bubble phase on window runs after every `document` listener of the same event.
    const release = () => {
      escTop.current = undefined;
    };
    window.addEventListener('keydown', snapshot, true);
    window.addEventListener('keydown', release);
    return () => {
      window.removeEventListener('keydown', snapshot, true);
      window.removeEventListener('keydown', release);
    };
  }, []);

  const api = useMemo<DialogStackApi>(
    () => ({
      register(id) {
        stack.current = pushDialog(stack.current, id);
        return () => {
          stack.current = removeDialog(stack.current, id);
        };
      },
      mayClose: (id) => escTop.current === undefined || escTop.current === id,
    }),
    [],
  );
  return <DialogStackContext.Provider value={api}>{children}</DialogStackContext.Provider>;
}

/** Registers a dialog while it is open and returns a close handler that Esc only honors for the topmost one. */
export function useGuardedClose(open: boolean, onClose: () => void): () => void {
  const api = useContext(DialogStackContext);
  if (!api) throw new Error('useGuardedClose must be used inside a DialogStackProvider.');
  const id = useId();
  const latest = useRef(onClose);
  latest.current = onClose;

  useEffect(() => (open ? api.register(id) : undefined), [api, id, open]);
  return useCallback(() => {
    if (api.mayClose(id)) latest.current();
  }, [api, id]);
}

export type GuardedOptionPaneProps = Omit<InterJOptionPane, 'onCancel'> & { onClose: () => void };

/** `JOptionPane` registered in the dialog stack; its cancel and Esc both go through the guard. */
export function GuardedOptionPane({ onClose, ...pane }: GuardedOptionPaneProps) {
  const guardedClose = useGuardedClose(pane.open, onClose);
  return <JOptionPane {...pane} onCancel={guardedClose} />;
}

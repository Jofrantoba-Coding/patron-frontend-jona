import { useEffect, useId, useLayoutEffect } from 'react';
import { JCONFIRMDIALOG_DEFAULTS, type InterJConfirmDialog } from './InterJConfirmDialog.js';
import { JConfirmDialogView } from './JConfirmDialogView.js';

/**
 * Implementación: el comportamiento de interacción del diálogo. Al abrirse, el foco va a
 * «Cancelar» (la opción que no destruye nada); al cerrarse, vuelve a donde estaba; Escape
 * cancela aunque el foco haya salido del diálogo. Efectos sobre el DOM, nunca sobre el sistema.
 */
export function JConfirmDialogImpl(props: InterJConfirmDialog) {
  const id = useId();
  const cancelId = `${id}-cancelar`;
  const { open, busy, onCancel } = props;

  // Antes del primer pintado: se guarda el foco anterior antes de moverlo.
  useLayoutEffect(() => {
    if (!open) return undefined;
    const anterior = document.activeElement instanceof HTMLElement ? document.activeElement : undefined;
    document.getElementById(cancelId)?.focus();
    return () => anterior?.focus();
  }, [open, cancelId]);

  useEffect(() => {
    if (!open || busy) return undefined;
    const alPulsar = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', alPulsar);
    return () => document.removeEventListener('keydown', alPulsar);
  }, [open, busy, onCancel]);

  return <JConfirmDialogView {...JCONFIRMDIALOG_DEFAULTS} {...props} titleId={`${id}-titulo`} messageId={`${id}-mensaje`} cancelId={cancelId} />;
}

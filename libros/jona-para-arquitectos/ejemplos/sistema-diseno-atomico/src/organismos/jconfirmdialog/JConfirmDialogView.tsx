import { JButton } from '../../atomos/jbutton/index.js';
import { JText } from '../../atomos/jtext/index.js';
import { BACKDROP, INLINE, PAD, STACK, SURFACE_RAISED, clases } from '../../tema/clasesToken.js';
import { JCONFIRMDIALOG_DEFAULTS, type InterJConfirmDialogVista } from './InterJConfirmDialog.js';

/** Vista: un diálogo de alerta compuesto con JText y JButton; render puro. El foco lo mueve la Implementación. */
export function JConfirmDialogView({
  open, title, message, busy, onConfirm, onCancel, titleId, messageId, cancelId,
  confirmLabel = JCONFIRMDIALOG_DEFAULTS.confirmLabel,
  cancelLabel = JCONFIRMDIALOG_DEFAULTS.cancelLabel,
}: InterJConfirmDialogVista) {
  if (!open) return null;
  return (
    <div className={BACKDROP}>
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={messageId}
        className={clases(SURFACE_RAISED, PAD, STACK)}
      >
        <JText as="h2" id={titleId}>{title}</JText>
        <JText id={messageId}>{message}</JText>
        <div className={INLINE}>
          <JButton id={cancelId} variant="secondary" disabled={busy} onClick={onCancel}>{cancelLabel}</JButton>
          <JButton disabled={busy} onClick={onConfirm}>{confirmLabel}</JButton>
        </div>
      </div>
    </div>
  );
}

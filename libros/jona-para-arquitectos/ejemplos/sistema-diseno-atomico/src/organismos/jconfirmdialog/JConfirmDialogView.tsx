import { JButton } from '../../atomos/jbutton/index.js';
import { JHeading } from '../../atomos/jheading/index.js';
import { JText } from '../../atomos/jtext/index.js';
import { BACKDROP, INLINE, PAD, STACK, SURFACE_RAISED, clases } from '../../tema/clasesToken.js';
import { JCONFIRMDIALOG_DEFAULTS, type InterJConfirmDialogVista } from './InterJConfirmDialog.js';

/** Vista: un diálogo de alerta compuesto con JHeading, JText y JButton; render puro. El foco lo mueve la Implementación. */
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
        <JHeading level={2} size="md" id={titleId}>{title}</JHeading>
        <JText id={messageId}>{message}</JText>
        <div className={INLINE}>
          <JButton id={cancelId} variant="secondary" disabled={busy} onClick={onCancel}>{cancelLabel}</JButton>
          <JButton disabled={busy} onClick={onConfirm}>{confirmLabel}</JButton>
        </div>
      </div>
    </div>
  );
}

// Layer: View. Pure render of the perfil permission dialog; the 13 flags are checkboxes, the matrix is one accordion row per form.
import { JAccordion, JAlert, JButton, JCheckBox, JDialog } from 'jona-ui';
import { PERMISSION_FLAGS } from '../../../domain/permissions';
import { PERMISOSDIALOG_DEFAULTS, type InterPermisosDialog, type PermisoRow } from './InterPermisosDialog';

type ViewProps = InterPermisosDialog & typeof PERMISOSDIALOG_DEFAULTS;

/** Floors, not fixed heights: 44px touch target on mobile, compact from `sm`. */
const TOUCH = 'min-h-11 sm:min-h-9';

export function PermisosDialogView({ title, header, saveLabel, flagLabels, rows, matrix, status, loadError, saving, message, onToggle, onSave, onClose }: ViewProps) {
  const flags = (row: PermisoRow) => (
    <div className="grid min-w-0 gap-1 sm:grid-cols-2">
      {PERMISSION_FLAGS.map((flag) => (
        <div key={flag} className={`flex items-center ${TOUCH}`}>
          <JCheckBox label={flagLabels[flag]} checked={row.flags[flag]} onCheckedChange={(value) => onToggle(row.formId, flag, value)} />
        </div>
      ))}
    </div>
  );
  return (
    <JDialog
      open
      title={title}
      size={matrix ? 'lg' : 'md'}
      onClose={onClose}
      footer={
        <JButton className={TOUCH} disabled={status !== 'ready' || saving} onClick={onSave}>
          {saveLabel}
        </JButton>
      }
    >
      <div className="grid min-w-0 gap-3">
        {header && <strong>{header}</strong>}
        {status === 'failed' && <JAlert variant="danger" role="alert">{loadError}</JAlert>}
        {message && <JAlert variant={message.kind === 'ok' ? 'success' : 'danger'} role="alert">{message.text}</JAlert>}
        {status === 'ready' &&
          (matrix ? (
            <div className="max-h-96 max-w-full overflow-auto">
              <JAccordion multiple headerClassName={TOUCH} items={rows.map((row) => ({ value: row.formId, title: row.formId, content: flags(row) }))} />
            </div>
          ) : (
            rows.map((row) => <div key={row.formId}>{flags(row)}</div>)
          ))}
      </div>
    </JDialog>
  );
}

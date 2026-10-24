// Layer: public entry. Wires the Impl hook to the pure View. Mount it to open, unmount on `onClose`.
import { PERMISOSDIALOG_DEFAULTS } from './InterPermisosDialog';
import { usePermisosDialogImpl, type PermisosTarget } from './PermisosDialogImpl';
import { PermisosDialogView } from './PermisosDialogView';

export function PermisosDialog({ onClose, ...target }: PermisosTarget & { onClose: () => void }) {
  const impl = usePermisosDialogImpl(target, onClose);
  return <PermisosDialogView {...PERMISOSDIALOG_DEFAULTS} {...impl} />;
}

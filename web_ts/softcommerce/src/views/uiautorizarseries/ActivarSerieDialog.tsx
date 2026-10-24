// Layer: public entry. Wires the Impl hook to the pure View. Mount it to open, unmount on `onClose` or `onDone`.
import { useActivarSerieDialogImpl, type ActivarTarget } from './ActivarSerieDialogImpl';
import { ActivarSerieDialogView } from './ActivarSerieDialogView';
import { ACTIVARSERIEDIALOG_DEFAULTS } from './InterUiAutorizarSeries';

export function ActivarSerieDialog(target: ActivarTarget) {
  const impl = useActivarSerieDialogImpl(target);
  return <ActivarSerieDialogView {...ACTIVARSERIEDIALOG_DEFAULTS} {...impl} />;
}

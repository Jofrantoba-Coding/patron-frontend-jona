// Layer: public entry. Wires the Impl hook to the pure View. Mount it to open, unmount on `onClose` or `onDone`.
import { PRECIODIALOG_DEFAULTS, type InterPrecioDialog } from './InterUiSocioAcciones';
import { usePrecioDialogImpl } from './PrecioDialogImpl';
import { PrecioDialogView } from './PrecioDialogView';

export function PrecioDialog(props: InterPrecioDialog) {
  const impl = usePrecioDialogImpl(props);
  return <PrecioDialogView {...PRECIODIALOG_DEFAULTS} {...props} {...impl} />;
}

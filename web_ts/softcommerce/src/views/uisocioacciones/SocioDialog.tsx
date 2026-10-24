// Layer: public entry. Wires the Impl hook to the pure View. Mount it to open, unmount on `onClose` or `onDone`.
import { SOCIODIALOG_DEFAULTS, type InterSocioDialog } from './InterUiSocioAcciones';
import { useSocioDialogImpl } from './SocioDialogImpl';
import { SocioDialogView } from './SocioDialogView';

export function SocioDialog(props: InterSocioDialog) {
  const impl = useSocioDialogImpl(props);
  return <SocioDialogView {...SOCIODIALOG_DEFAULTS} {...impl} />;
}

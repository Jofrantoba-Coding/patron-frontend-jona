// Layer: public entry. Wires the Impl hook to the pure View.
import type { InterLookupDialog } from './InterLookupDialog';
import { useLookupDialogImpl } from './LookupDialogImpl';
import { LookupDialogView } from './LookupDialogView';

/** The modal search-and-pick dialog of a picker config (R-LKP-1): server-side filters and paging, one row handed to the host. */
export function LookupDialog(props: InterLookupDialog) {
  return <LookupDialogView {...useLookupDialogImpl(props)} />;
}

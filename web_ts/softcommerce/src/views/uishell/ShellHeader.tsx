// Layer: public entry. Wires the Impl hook to the pure View.
import { SHELLHEADER_DEFAULTS } from './InterShellHeader';
import { useShellHeaderImpl } from './ShellHeaderImpl';
import { ShellHeaderView } from './ShellHeaderView';

export function ShellHeader() {
  const impl = useShellHeaderImpl();
  return <ShellHeaderView {...SHELLHEADER_DEFAULTS} {...impl} />;
}

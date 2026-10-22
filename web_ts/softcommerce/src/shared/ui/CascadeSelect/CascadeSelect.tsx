// Layer: public entry. Wires the Impl hook to the pure View.
import { CASCADESELECT_DEFAULTS } from './InterCascadeSelect';
import { useCascadeSelectImpl, type CascadeSelectProps } from './CascadeSelectImpl';
import { CascadeSelectView } from './CascadeSelectView';

/** Cascading selects: a level loads after the one above is chosen; changing a level clears the ones below. */
export function CascadeSelect(props: CascadeSelectProps) {
  const impl = useCascadeSelectImpl(props);
  return <CascadeSelectView {...CASCADESELECT_DEFAULTS} {...impl} />;
}

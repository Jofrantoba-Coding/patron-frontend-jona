// Layer: View. Pure render of props already resolved by the Impl; no state, effects or services.
import { JTextBox } from 'jona-ui';
import type { InterUiDemoStub } from './InterUiDemoStub';

export function UiDemoStubView({ filterLabel, filter, grantedActions, onFilterChange }: InterUiDemoStub) {
  return (
    <section style={{ display: 'grid', gap: 12 }}>
      <JTextBox aria-label={filterLabel} value={filter} onChange={(value) => onFilterChange?.(value)} />
      <p>Acciones permitidas: {grantedActions.length > 0 ? grantedActions.join(', ') : 'ninguna'}</p>
    </section>
  );
}

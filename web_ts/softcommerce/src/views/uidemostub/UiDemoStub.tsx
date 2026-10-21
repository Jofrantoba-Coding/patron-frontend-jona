// Layer: public entry. Wires the Impl hook to the pure View.
import type { Permissions } from '../../domain/permissions';
import { UIDEMOSTUB_DEFAULTS } from './InterUiDemoStub';
import { useUiDemoStubImpl } from './UiDemoStubImpl';
import { UiDemoStubView } from './UiDemoStubView';

/** Minimal registered form: one filter input, so tab state is testable before real forms exist. */
export function UiDemoStub({ permissions }: { permissions: Permissions }) {
  const impl = useUiDemoStubImpl(permissions);
  return <UiDemoStubView {...UIDEMOSTUB_DEFAULTS} {...impl} />;
}

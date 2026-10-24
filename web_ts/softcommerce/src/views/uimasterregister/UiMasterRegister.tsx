// Layer: public entry. Wires the Impl hook to the pure View; same props as the generic register, so a catalog with children swaps it in.
import type { UiCrudRegisterProps } from '../uicrudregister/UiCrudRegister';
import { useUiMasterRegisterImpl } from './UiMasterRegisterImpl';
import { UiMasterRegisterView } from './UiMasterRegisterView';

/** Tabbed register with child grids for a catalog config that declares `children`. Mount it to open, unmount on `onClose`. */
export function UiMasterRegister<T>({ config, service, mode, id, permissions, ...handlers }: UiCrudRegisterProps<T>) {
  const impl = useUiMasterRegisterImpl(config, service, mode, id, handlers, permissions);
  return <UiMasterRegisterView {...impl} />;
}

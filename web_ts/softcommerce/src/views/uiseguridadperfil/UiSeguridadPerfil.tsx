// Layer: public entry. Wires the Impl hook to the pure View.
import type { Permissions } from '../../domain/permissions';
import { UISEGURIDADPERFIL_DEFAULTS } from './InterUiSeguridadPerfil';
import { useUiSeguridadPerfilImpl } from './UiSeguridadPerfilImpl';
import { UiSeguridadPerfilView } from './UiSeguridadPerfilView';

/** `mi_SeguridadPerfil`: pick a perfil and edit its menu tree and its form permissions (R-PRM-1 to R-PRM-4). */
export function UiSeguridadPerfil(_props: { permissions?: Permissions }) {
  const impl = useUiSeguridadPerfilImpl();
  return <UiSeguridadPerfilView {...UISEGURIDADPERFIL_DEFAULTS} {...impl} />;
}

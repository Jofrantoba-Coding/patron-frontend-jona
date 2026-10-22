import type { MenuItem } from '../domain/menuTree';
import type { Permissions } from '../domain/permissions';

/**
 * Shell data: the dynamic menu and per-form permissions. Failures reject with `ApiError`.
 * Both calls take the tenant from the session.
 */
export interface InterShellService {
  /** Flat `MenuDinamico` list; `buildMenuTree` nests it. */
  menu(): Promise<MenuItem[]>;
  /** The 13 action flags of a form; an unknown form comes back all `false`. */
  permissions(formId: string): Promise<Permissions>;
}

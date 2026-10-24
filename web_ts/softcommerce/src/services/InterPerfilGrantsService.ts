import type { MenuItem } from '../domain/menuTree';
import type { PermissionFlag, Permissions } from '../domain/permissions';

/** A menu node with its visibility for one perfil (`GET /v1/tipos-trabajador-perfil/{id}/menu`). */
export interface PerfilMenuNode extends MenuItem {
  visible: boolean;
}

/** One toggled node, the only thing a menu `PUT` carries (R-PRM-2). */
export interface MenuChange {
  id: number;
  visible: boolean;
}

/** The 13 flags of one form of the app for a perfil. */
export type PerfilForm = { formId: string } & Permissions;

/** One toggled flag of one form, the only thing a permisos `PUT` carries (R-PRM-3, R-PRM-4). */
export interface PermisoChange {
  formId: string;
  flag: PermissionFlag;
  value: boolean;
}

/**
 * The perfil permission editor over `/v1/tipos-trabajador-perfil/{id}/...` (R-PRM-5). Kept apart from `InterCatalogService`, whose
 * method set the W1 contract pins (S-LOC-17). Failures reject with `ApiError`; the tenant comes from the session.
 */
export interface InterPerfilGrantsService {
  menu(perfilId: string): Promise<PerfilMenuNode[]>;
  /** Stores the changed nodes only and answers the whole menu as stored. */
  saveMenu(perfilId: string, changes: MenuChange[]): Promise<PerfilMenuNode[]>;
  /** Every form of the app with its 13 flags for the perfil. */
  permisos(perfilId: string): Promise<PerfilForm[]>;
  /** The 13 flags of one form for the perfil. */
  permiso(perfilId: string, formId: string): Promise<Permissions>;
  /** Stores the changed cells only and answers every form as stored. */
  savePermisos(perfilId: string, changes: PermisoChange[]): Promise<PerfilForm[]>;
  /** Single-form route: the form comes from the path, and the answer is its flags as stored. */
  savePermiso(perfilId: string, formId: string, changes: PermisoChange[]): Promise<Permissions>;
}

import type { MenuItem } from '../domain/menuTree';
import type { Permissions } from '../domain/permissions';

/** The menu and the flags of every form of the user's perfil, taken once at login (R-AUTH-11). */
export interface GrantsSnapshot {
  menu: MenuItem[];
  permissions: Record<string, Permissions>;
}

/** Reads the grants of the acting user (`X-User-Id`) in one go. Failures reject with `ApiError`. */
export interface InterGrantsService {
  snapshot(): Promise<GrantsSnapshot>;
}

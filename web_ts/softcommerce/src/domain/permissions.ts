/** The 13 action flags of `GET /forms/{formId}/permissions`. Fail closed: only a literal `true` grants. */

export const PERMISSION_FLAGS = [
  'add', 'modify', 'eliminate', 'nullify', 'clone', 'details', 'search',
  'report', 'export', 'print', 'printFast', 'close', 'refresh',
] as const;

export type PermissionFlag = (typeof PERMISSION_FLAGS)[number];
export type Permissions = Record<PermissionFlag, boolean>;

/** Every action denied: used when the permissions cannot be loaded. */
export const DENY_ALL: Readonly<Permissions> = Object.freeze(
  Object.fromEntries(PERMISSION_FLAGS.map((flag) => [flag, false])) as Permissions,
);

/** Reads the 13 flags from an untrusted payload; anything missing or not exactly `true` is denied. */
export function parsePermissions(raw: unknown): Permissions {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return { ...DENY_ALL };
  const record = raw as Record<string, unknown>;
  return Object.fromEntries(PERMISSION_FLAGS.map((flag) => [flag, record[flag] === true])) as Permissions;
}

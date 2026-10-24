import { hashPassword } from '../core/password.js';

/**
 * Closed set of backings (`entry.backing`, D15, R-REG-18): a read-write entry whose rows are NOT a section of its own but records another part of the store
 * already holds, so there is one source and no copy. Today that is the auth users: the Usuario master and the login read and write `store.shared.users`.
 * The projection of Wave 2 (`project.js`) was read-only; a backing is how a master gets write access to the same rows.
 *
 * A backing is `{ rows, all, insert, present, stored, seed }`:
 * - `rows(store, tenantId)`: the LIVE records of the tenant (an edit of one is an edit of the store); `all(store)` every record, for the next id.
 * - `insert(store, tenantId, row)`: stores a new record for the tenant and returns the stored object.
 * - `present(row)`: the record as a master sees it: the hidden keys gone, the form flags as booleans. `stored(row)`: the same record in its stored form (in place).
 * - `seed(rows)`: what the store holds after load, from the seed rows.
 *
 * @typedef {{ rows: (store: any, tenantId: string) => any[], all: (store: any) => any[], insert: (store: any, tenantId: string, row: any) => any,
 *   present: (row: any) => any, stored: (row: any) => any, seed: (rows: any[]) => any[] }} Backing
 */

/** The stored flag each form checkbox derives, and the value that means "on" (`users.json`: `flaghabilitado` A/D, the others S/N). */
const FLAGS = /** @type {const} */ ([['habilitado', 'flaghabilitado', 'A'], ['escritorio', 'flagEscritorio', 'S'], ['web', 'flagWeb', 'S'], ['contable', 'flagContable', 'S']]);

/** Keys no response and no form value ever carries (R-MOCK-23): the password, its confirmation and its hash, and the tenants of the user. */
const HIDDEN = ['clave', 'clave_hash', 'clave_confirmacion', 'tenants'];

/** @type {Backing} */
const users = {
  rows: (store, tenantId) => store.shared.users.filter((/** @type {any} */ u) => u.tenants.includes(tenantId)),
  all: (store) => store.shared.users,
  insert(store, tenantId, row) {
    const stored = { ...users.stored(row), tenants: [tenantId] };
    store.shared.users.push(stored);
    return stored;
  },
  present(row) {
    const out = { ...row };
    for (const key of HIDDEN) delete out[key];
    for (const [alias, flag, on] of FLAGS) out[alias] = row[flag] === on;
    return out;
  },
  stored(row) {
    for (const [alias] of FLAGS) delete row[alias];
    return row;
  },
  // The W1 seed keeps its shape (`users.json` is not edited): the id becomes text like every other id, the plaintext becomes the salted hash (D16) so login
  // has one compare path, and the flags a W1 user never had are off.
  seed: (rows) =>
    (rows ?? []).map((/** @type {any} */ { clave, ...user }) => {
      const id = String(user.id_usuario);
      return { ...user, id_usuario: id, flagWeb: user.flagWeb ?? 'N', flagContable: user.flagContable ?? 'N', ...(clave === undefined ? {} : { clave_hash: hashPassword(id, String(clave)) }) };
    }),
};

/** @type {Record<string, Backing>} */
export const BACKINGS = { users };
